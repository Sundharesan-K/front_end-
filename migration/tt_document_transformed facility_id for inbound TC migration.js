var collectionName = "tt_document_transformed_sundhar009";
var facilityCollection = "facility_sundhar07"

const bulkOps = [
    {
        updateMany: {
            filter: {
                "tc_extracted_data.tx_type": "INBOUND",
                "tc_extracted_data.facility_id": { $exists: true },
                "tc_extracted_data.facility_id.key": { $exists: true },
                "tc_extracted_data.facility_id.value": { $exists: true }
            },
            update: {
                $rename: {
                    "tc_extracted_data.facility_id.key": "tc_extracted_data.facility_id.facility_reference_id",
                    "tc_extracted_data.facility_id.value": "tc_extracted_data.facility_id.facility_name"
                }
            }
        }
    }
];

db.getCollection(collectionName).bulkWrite(bulkOps);

const bulkOpsforRename = [
    {
        updateMany: {
            filter: {
                "tc_extracted_data.tx_type": "INBOUND",
                "tc_extracted_data.facility_id": { $exists: true }
            },
            update: {
                $rename: {
                    "tc_extracted_data.facility_id": "tc_extracted_data.seller_facility"
                }
            }
        }
    }
];

db.getCollection(collectionName).bulkWrite(bulkOpsforRename);

// Find distinct values directly using distinct method
var referenceIds = db.getCollection(collectionName).distinct("tc_extracted_data.seller_facility.facility_reference_id");


var response = db.getCollection(facilityCollection).find({
    "reference_id": { $in: referenceIds }
}).toArray();  // Fetch all documents at once

var mapObject = {};

// Iterate over the fetched documents
response.forEach(data => {
    mapObject[data.reference_id] = data._id.toString();
});

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
            "tc_extracted_data.seller_facility.facility_id": value,
            "update_ts": ISODate(),
            "updated_by": "ffffffffffffffffffffffff"
        }
    });
}
for(const [key, value] of Object.entries(mapObject)){
    var filter = {
        "tc_extracted_data.tx_type": "INBOUND",
        "tc_extracted_data.seller_facility": { $exists: true },
        "tc_extracted_data.seller_facility.facility_reference_id": { $exists: true },
        "tc_extracted_data.seller_facility.facility_reference_id": key
    };
   var documents = bulk.find(filter).update({
    $set: {
        "tc_extracted_data.seller_facility.facility_id": value,
        "update_ts": ISODate(),
        "updated_by": "ffffffffffffffffffffffff"
         }
    })
    documents.forEach(function(doc){
        print("Updated Ids "+doc._id)
    })
}

var result = bulkOperation.execute();
// result.forEach(function(doc){
//     print("Updated Ids "+doc._id)
// })

print("Updated " + result.modifiedCount + " records");

print("SCRIPT EXECUTION COMPLETED SUCCESSFULLY");
