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
    var collection = db[collectionName];
    var result = collection.find({
        $or: [
            {"create_ts": {$exists: false}},
            {"update_ts": {$exists: false}},
            {"updated_by": {$exists: false}},
            {"created_by": {$exists: false}}
        ]
    }).toArray();

    if (result.length > 0) {
        var bulkUpdateOps = result.map(document => {
            var updateFields = {};
            if (!document.create_ts) {
                updateFields["create_ts"] = new ISODate();
            }
            if (!document.update_ts) {
                updateFields["update_ts"] = new ISODate();
            }
            if (!document.created_by) {
                updateFields["created_by"] = "ffffffffffffffffffffffff";
            }
            if (!document.updated_by) {
                updateFields["updated_by"] = "ffffffffffffffffffffffff";
            }

            return {
                updateOne: {
                    filter: {_id: document._id},
                    update: {$set: updateFields}
                }
            };
        });

        collection.bulkWrite(bulkUpdateOps);
        print(collectionName + ": " + result.length + " documents updated.");
    }
});
