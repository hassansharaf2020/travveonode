var db = require('./db')
const config = require('../config');
const { currentdate } = require('./basemodels');
const citymodel = require('./cities');

exports.findPropertyCodeId =  async function(provderid,code){
    var rows = await db.asyncexecute("SELECT * FROM `providers_property_codes` where code='"+code+"' and provider_id="+provderid);
    return rows[0];
}

exports.findPropertyInfoDataByPI=  async function(property_id){
    var rows = await db.asyncexecute("SELECT * FROM `property_info_data` where property_id="+property_id);
    if(typeof rows[0] == 'undefined') return 0;
    return rows[0]['property_id'];
}

exports.addPropertyInfo =  async function(countrycode,cityname){
    var country_id = await citymodel.getCountriesByCode(countrycode);
    var city_id  =  await citymodel.getcityByname(cityname,country_id);
    sql = "INSERT INTO `property_info` SET `city_id`="+city_id+",`country_id`="+country_id+" , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
    var rows = await db.asyncexecute(sql);
    return rows['insertId'];
}

exports.addPropertyCode =  async function(providerid,propertyid,code){
    sql  = "INSERT INTO `providers_property_codes` SET `provider_id`="+providerid+",`property_id`="+propertyid+" , code='"+code+"'";
    var rows = await db.asyncexecute(sql);
    return rows['insertId'];
}

exports.findOrSavePropertyImage = async function(propertyId, href, width, height, size){
    var rows = await db.asyncexecute("SELECT * FROM `property_images` where href='"+href+"' and property_id="+propertyId);
    if(typeof rows[0] == 'undefined') {
        sql  = "INSERT INTO `property_images` SET `href`='"+href+"',`property_id`="+propertyId+" , width='"+width+"' ,height='"+height+"' ,size='"+size+"' , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
        var rows = await db.asyncexecute(sql);
        id = rows['insertId'];
        return {id ,'inserted':true}
    }else return {'id' : rows[0]['id'],'inserted' : false}
}


exports.findOrSavePropertyDescription = async function(property_id, title, code, para, lang_id){
    var para = para.replaceAll('"',"'");
    para = para.replaceAll('.'," ");
    var rows = await db.asyncexecute("SELECT * FROM `property_description` where code='"+code+"' and lang_id='"+lang_id+"' and property_id="+property_id);
    if(typeof rows[0] == 'undefined') {
        sql  = 'INSERT INTO `property_description` SET `code`='+code+',`property_id`='+property_id+' , title="'+title+'" ,para="'+para+'" ,lang_id='+lang_id+' , `created_at`="'+currentdate()+'" , `updated_at`="'+currentdate()+'"';
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else return rows[0]['id'];
}

exports.getPropertyFactsByFactid = async function(factid){
    var rows = await db.asyncexecute("SELECT * FROM `property_facts` where fact_id="+factid);
    if(typeof rows[0] == 'undefined') return 0;
    return rows[0]['id'];
}


exports.addPropertyFacts = async function(property_id,type,name,fact_id,fact_name,typeHint,value){
    sql  = "INSERT INTO `property_facts` SET `property_id`="+property_id+" ,`section_type`="+type+",section_name='"+name+"' ,fact_id='"+fact_id+"' ,fact_name='"+fact_name+"' ,typeHint='"+typeHint+"' ,value='"+value+"' , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
    var rows = await db.asyncexecute(sql);
    return id = rows['insertId'];
}


exports.SavePropertyInfo =  async function(id,country_id,city_id,airports,ratings,lat,lon,category_id,stars,rooms_count,channel_manager){
    var data = " `city_id`="+city_id+",`country_id`='"+country_id+"' ,`airports`='"+airports+"' ,`ratings`='"+ratings+"' ,`lat`='"+lat+"' ,`lon`='"+lon+"' ,`category_id`='"+category_id+"' ,`stars`='"+stars+"' ,`rooms_count`='"+rooms_count+"' ,`channel_manager`='"+channel_manager+"' , ";
    if(!id || typeof id== 'undefined'){
        var sql = "INSERT INTO `property_info` SET " + data +"`created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else{
        var sql = "UPDATE `property_info` SET " + data +" `updated_at`='"+currentdate()+"' WHERE id="+id;
        var rows = await db.asyncexecute(sql);
        return id;
    }
}


exports.SavePropertyInfoData =  async function(id,property_id,title,destination,alternativeNames,address,postal_code,street,langid){
    var data = '`property_id`='+property_id+', `title`="'+title+'",`destination`="'+destination+'" ,`alternativeNames`="'+alternativeNames+'" ,`address`="'+address+'" ,`postal_code`="'+postal_code+'" ,`street`="'+street+'" ,`lang_id`="'+langid+'" , ';
    if(!id || typeof id== 'undefined'){
        var sql = "INSERT INTO `property_info_data` SET " + data +"`created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else{
        var sql = "UPDATE `property_info_data` SET " + data +" `updated_at`='"+currentdate()+"' WHERE id=".id;
        var rows = await db.asyncexecute(sql);
        return id;
    }
}

exports.findOrSavePropertyContactType =  async function(title,lang_id){
    var rows = await db.asyncexecute("SELECT * FROM `property_contact_type` where title='"+title+"'");
    if(typeof rows[0] == 'undefined') {
        sql  = "INSERT INTO `property_contact_type` SET `title`='"+title+"' , `lang_id`="+lang_id;
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else return rows[0]['id'];
}


exports.findOrSavePropertyContact =  async function(type_id,phone,property_id){
    
    var rows = await db.asyncexecute("SELECT * FROM `property_contacts` where type_id="+type_id+" and phone='"+phone+"'");
    if(typeof rows[0] == 'undefined') {
        sql  = "INSERT INTO `property_contacts` SET `priority`=1,`phone`='"+phone+"',`type_id`="+type_id+",`property_id`="+property_id+", `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else return rows[0]['id'];
}

exports.providerTypeId = async function(service){
    var rows = await db.asyncexecute("SELECT * FROM `provider_type` where title='"+service+"'");
    if(typeof rows[0] == 'undefined') return 0;
    return rows[0]['id'];
}

exports.findOrSaveProviders =  async function(providerCode, providerType){
    var rows = await db.asyncexecute("SELECT * FROM `providers` where provider_type_id="+providerType+" and code='"+providerCode+"'");
    if(typeof rows[0] == 'undefined') {
        sql  = "INSERT INTO `providers` SET `provider_type_id`="+providerType+",`code`='"+providerCode+"',`active`='0', `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else return rows[0]['id'];
}

exports.findOrSaveProvidersPropertyCodes =  async function(provider_id, property_id, code){
    var rows = await db.asyncexecute("SELECT * FROM `providers_property_codes` where provider_id="+provider_id+" and property_id="+property_id+" and code='"+code+"'");
    if(typeof rows[0] == 'undefined') {
        sql  = "INSERT INTO `providers_property_codes` SET `provider_id`="+provider_id+",`code`='"+code+"',`property_id`='"+property_id+"'";
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else return rows[0]['id'];
}

exports.findOrSavePropertyChainMaster=  async function(id){
    sql  = "INSERT INTO `property_chain_master` SET `id`="+id+" , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"' ON DUPLICATE KEY UPDATE `id`="+id+"";
    var rows = await db.asyncexecute(sql);
    return id;
}

exports.findOrSavePropertyChainData =  async function(name, lang_id,chain_code){
    var rows = await db.asyncexecute('SELECT * FROM `property_chain_data` where title="'+name+'"');
    if(typeof rows[0] == 'undefined') {
        sql  = 'INSERT INTO `property_chain_data` SET `title`="'+name+'",`lang_id`="'+lang_id+'",`master_chain_id`="'+chain_code+'", `created_at`="'+currentdate()+'" , `updated_at`="'+currentdate()+'"';
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else return rows[0]['id'];
}


exports.findOrSavePropertyChain =  async function(chainId, propertyId){
    var rows = await db.asyncexecute("SELECT * FROM `property_chain` where chain_id='"+chainId+"' and property_id='"+propertyId+"'");
    if(typeof rows[0] == 'undefined') {
        sql  = "INSERT INTO `property_chain` SET `chain_id`="+chainId+",`property_id`='"+propertyId+"'";
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else return rows[0]['id'];
}


exports.findOrSaveProviderPropertyChain =  async function(provider_id, code, chainId){
    var rows = await db.asyncexecute("SELECT * FROM `provider_property_chain` where chain_id='"+chainId+"' and provider_id='"+provider_id+"' and code='"+code+"'");
    if(typeof rows[0] == 'undefined') {
        sql  = "INSERT INTO `provider_property_chain` SET `chain_id`="+chainId+",`provider_id`='"+provider_id+"', `code`='"+code+"'";
        var rows = await db.asyncexecute(sql);
        return rows['insertId'];
    }else return rows[0]['id'];
}