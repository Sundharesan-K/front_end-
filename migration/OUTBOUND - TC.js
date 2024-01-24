const collectionName = "tt_document_transformed"
const tttransaction = "tt_transaction"

const renameForFieldName = [
        {
            updateMany : {
                filter : {
                    "tc_extracted_data.tx_type":"OUTBOUND",
                    "status":"ACTIVE",
                    "tc_extracted_data.facility_id":{$exists:true},
                    "tier_id" : {"$nin" : ["tr_tier1"]}
                },
                update : {
                       $rename : {
                            "tc_extracted_data.facility_id":"tc_extracted_data.customer_facility"
                       }
                }
            }
        }
];
db.getCollection(collectionName).bulkWrite(renameForFieldName);

const renameField = [
    {
        updateMany : {
            filter : {

                "tc_extracted_data.tx_type":"OUTBOUND",
                "tc_extracted_data.customer_facility.key":{$exists:true},
                "tc_extracted_data.customer_facility.value":{$exists:true}

            },
            update : {
                   $rename : {
                        "tc_extracted_data.customer_facility.key":"tc_extracted_data.customer_facility.facility_reference_id",
                        "tc_extracted_data.customer_facility.value":"tc_extracted_data.customer_facility.facility_name"
                   }
            }
        }
    }
];
db.getCollection(collectionName).bulkWrite(renameField);

var findTTDocumentIds = db.getCollection(collectionName).find({"tc_extracted_data.customer_facility.facility_reference_id" : { $exists : true },
         "tc_extracted_data.customer_facility.facility_name" : { $exists : true }},
         {tt_document_id:1}
)

var ttDocumentIds = [];

findTTDocumentIds.forEach(data => {
    ttDocumentIds.push(data.tt_document_id);
})

var tttransactionDoc = db.getCollection(tttransaction).find({
    "outbound_data.tt_document_id" : {$in : ttDocumentIds}
}).toArray();

var transactionMap = {};

tttransactionDoc.forEach(data =>{
    transactionMap[data.outbound_data.tt_document_id] = data.outbound_data.customer_facility_id;
})
var bulkDocuments = db.getCollection(collectionName).initializeUnorderedBulkOp();

for (const [key, value] of Object.entries(transactionMap)) {
    bulkDocuments.find({
        "tc_extracted_data.tx_type": "OUTBOUND",
        "tc_extracted_data.customer_facility.facility_reference_id": { $exists: true },
        tt_document_id : key
    }).update({
        $set: {
            "tc_extracted_data.customer_facility.facility_id": value
        }
    });
}

var result = bulkDocuments.execute();
var count = result.modifiedCount;
if (count > 0) {
    var updated = db.getCollection(collectionName).find({ "tc_extracted_data.customer_facility.facility_id": { $exists: true } },
        { _id: 1 });
    var updatedDocumentIds = updated.toArray().map(doc => doc._id);
    for (const id of updatedDocumentIds) {
        print(`Updated document ID: ${id}`);
    }
}
print("Updated " + count + " records");

var setUpdates = db.getCollection(collectionName).updateMany(
    {
        "tc_extracted_data.tx_type": "OUTBOUND",
         "tc_extracted_data.customer_facility.facility_reference_id":{$exists:true}
    },
    [
    {
        $set : {
            "tc_extracted_data.product_info" : {
                $map : {
                    input : "$tc_extracted_data.product_info",
                    as : "fi",
                    in : {
                        $mergeObjects:[
                        "$$fi",
                        {"customer_facility":"$tc_extracted_data.customer_facility"}
                        ]
                    }
                }
            },
            "update_ts": new ISODate()
        }
    },
    {
        $unset : "tc_extracted_data.customer_facility"
    }
    ],
    { multi: true }
)
print("Updated Set operation "+setUpdates.modifiedCount+" records");


