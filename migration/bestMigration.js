var collectionName = "tt_document_transformed_sundhar009";
var facilityCollection = "facility_sundhar07"

db.getCollection(collectionName).updateMany(
    {
        "tc_extracted_data.tx_type": "INBOUND",
        "tc_extracted_data.facility_id": { $exists: true },
        "tc_extracted_data.facility_id.key": { $exists: true },
        "tc_extracted_data.facility_id.value": { $exists: true }
    },
    {
        $rename: {
            "tc_extracted_data.facility_id.key": "tc_extracted_data.facility_id.facility_reference_id",
            "tc_extracted_data.facility_id.value": "tc_extracted_data.facility_id.facility_name",

        }
    },
    {
        multi: true
    }
)

db.getCollection(collectionName).updateMany(
    {
        "tc_extracted_data.tx_type": "INBOUND",
        "tc_extracted_data.facility_id": { $exists: true },
        "tc_extracted_data.facility_id.facility_reference_id": { $exists: true },
        "tc_extracted_data.facility_id.facility_name": { $exists: true }
    },
    {
        $rename: {
            "tc_extracted_data.facility_id": "tc_extracted_data.seller_facility",
        }
    },
    {
        multi: true
    }
)

var reference_id = db.getCollection(collectionName).distinct(

    "tc_extracted_data.seller_facility.facility_reference_id"

)

var response = db.getCollection(facilityCollection).find({
    "reference_id": { $in: reference_id }
})

var mapObject = {};

while (response.hasNext()) {
    data = response.next();
    mapObject[data.reference_id] = data._id.toString();
}

//This is BulkWrite Operation large number of documents modified performance is faster
var bulk = db.getCollection(collectionName).initializeUnorderedBulkOp();

for (const [key, value] of Object.entries(mapObject)) {
    bulk.find({
        "tc_extracted_data.tx_type": "INBOUND",
        "tc_extracted_data.seller_facility": { $exists: true },
        "tc_extracted_data.seller_facility.facility_reference_id": { $exists: true },
        "tc_extracted_data.seller_facility.facility_reference_id": key
    }).update({
        $set: {
            "tc_extracted_data.seller_facility.facility_id": value
        }
    });
}

var result = bulk.execute();

