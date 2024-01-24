var collections = [
    "brand_extraction_config",
    "cert_config",
    "certificate_deeper_validation_config",
    "certificate_field_extraction_config",
    "certificate_master_config",
    "certificate_table_identification_config",
    "certificate_transformation_config",
    "certificate_validation_config",
    "classification_config",
    "cmc_settings",
    "cmc_validation_config",
    "cmc_validation_master_data",
    "epcis_event",
    "extraction_engine_classification_config",
    "lot_data",
    "tt_certificate",
    "tt_transaction",
    "tt_document",
    "tt_document_transformed",
    "textract_job",
    "transaction_tier_config",
    "tt_document_extraction_audit",
    "tt_bot_config",
    "wastage_config",
    "wastage_config_master_data"
]

collections.forEach(collectionName => {
    print(collectionName);

    var bulkUpdates = [];

    var result = db[collectionName].find({
        $or: [
            { "create_ts": { $exists: false } },
            { "update_ts": { $exists: false } },
            { "updated_by": { $exists: false } },
            { "created_by": { $exists: false } }
        ]
    });

    result.forEach(document => {
        var updateOps = {};
        if(!document.create_ts){
            updateOps["create_ts"] = new ISODate();
        }
        if(!document.update_ts){
            updateOps["update_ts"] = new ISODate();
        }
        if(!document.updated_by){
            updateOps["updated_by"] = new ISODate();
        }
        if(!document.created_by){
            updateOps["created_by"] = new ISODate();
        }

        bulkUpdates.push({
            updateOne: {
                filter : {_id: document._id},
                update : {$set : updateOps}
            }
        });

        if(bulkUpdates.length === 1000){
            db.getCollection(collectionName).bulkWrite(bulkUpdates);
            bulkUpdates = [];
        }
    });
    
    if (bulkUpdates.length > 0) {
        db.getCollection(singleCollection).bulkWrite(bulkUpdates);
      }
});