var ttCollections = [
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
    "cmc_validation_master_data",
    "epcis_event",
    "extraction_engine_classification_config",
    "lot_data",
    "tt_certificate",
    "tt_document",
    "tt_document_transformed",
    "textract_job",
    "transaction_tier_config",
    "tt_document_extraction_audit",
    "tt_bot_config", 
    "wastage_config",
    "wastage_config_master_data"
];

ttCollections.forEach(singleCollection =>{
print(singleCollection)
var result = db.getCollection(singleCollection).find({$or:[
    {"create_ts":{$exists:false}},
    {"update_ts":{$exists:false}},
    {"updated_by":{$exists:false}},
    {"created_by":{$exists:false}}
  ]}).toArray();

result.forEach(document =>{
if(!document.create_ts){
db.getCollection(singleCollection).updateOne(
{_id:document._id},
{$set:{"create_ts":new ISODate()}},
{$multi:false}
)
}
if(!document.update_ts){
db.getCollection(singleCollection).updateOne(
{_id:document._id},
{$set:{"update_ts":new ISODate()}},
{$multi:false}
)
}
if(!document.created_by){
db.getCollection(singleCollection).updateOne(
{_id:document._id},
{$set:{"created_by":"ffffffffffffffffffffffff"}},
{$multi:false}
)
}
if(!document.updated_by){
db.getCollection(singleCollection).updateOne(
{_id:document._id},
{$set:{"updated_by":"ffffffffffffffffffffffff"}},
{$multi:false}
)
}
})
print(document)
})

