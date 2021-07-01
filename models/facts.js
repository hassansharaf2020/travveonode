var db = require('./db')
const config = require('../config');
const { currentdate } = require('./basemodels');

exports.addFeaturecatregoryData = async function(title,cat_id){
    var sql = "INSERT INTO `feature_category_data` (`title`,`feature_cat_id`,`lang_id`, `created_at` , `updated_at`) SELECT * FROM (SELECT '"+title+"',"+cat_id+" , 0"+config.lang_id+",'"+currentdate()+"' ,'"+currentdate()+":00') AS tmp WHERE NOT EXISTS ( SELECT `title`,`feature_cat_id` ,`lang_id` FROM `feature_category_data` WHERE `title`='"+title+"' and `lang_id`="+config.lang_id+") LIMIT 1"
    var cats = await db.asyncexecute(sql);
    return cats['insertId'];

    // var sql = "SELECT * FROM feature_category_data WHERE title='"+title+"' and `lang_id`="+config.lang_id;
    // var rows = await db.asyncexecute(sql);
    // if(typeof rows[0] == 'undefined'){
    //     var sql = "INSERT INTO feature_category_data SET `title`='"+title+"' , `feature_cat_id`="+cat_id+" ,`lang_id`="+config.lang_id+" , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
    //     var cats = await db.asyncexecute(sql);
    //     return cats['insertId'];
    // }else return rows[0]['feature_cat_id'];
}

exports.addFeaturecatregory = async function(){
    // var sql = "INSERT INTO `feature_category` (`type`, `created_at` , `updated_at`) SELECT * FROM (SELECT 'facility','"+currentdate()+"' ,'"+currentdate()+":00' ) AS tmp WHERE NOT EXISTS ( SELECT `type` FROM `feature_category` WHERE type = 'facility') LIMIT 1"
    // var cats = await db.asyncexecute(sql);
    // if(!cats['insertId']){
    //     var sql = "SELECT * FROM feature_category WHERE `type`='facility' ";
    //     var rows = await db.asyncexecute(sql);
    //     return rows[0]['id'];
    // }
    // return cats['insertId'];

    var sql = "INSERT INTO feature_category SET `type`='facility' , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
    var cats = await db.asyncexecute(sql);
    return cats['insertId']
}

exports.getFeatureCatregoryDataBytitle = async function(title){
    var sql = "SELECT * FROM feature_category_data WHERE title='"+title+"' and `lang_id`="+config.lang_id;
    var rows = await db.asyncexecute(sql);
    if(typeof rows[0] == 'undefined') return 0;
    else return rows[0]['feature_cat_id'];
}

exports.addFeature = async function(cat_id,type){
    var type = gettype(type);

    // var sql = "INSERT INTO `features` (`type`, `category_id`, `created_at` , `updated_at`) SELECT * FROM (SELECT '"+type+"' , "+cat_id+" ,'"+currentdate()+"' ,'"+currentdate()+":00') AS tmp WHERE NOT EXISTS ( SELECT `type` FROM `features` WHERE type = '"+type+"' and `category_id`="+cat_id+") LIMIT 1"
    // var cats = await db.asyncexecute(sql);
    // if(!cats['insertId']){
    //     var sql = "SELECT * FROM features WHERE `type`='"+type+"' ";
    //     var rows = await db.asyncexecute(sql);
    //     return rows[0]['id'];
    // }
    // return cats['insertId'];

    var sql = "INSERT INTO features SET `type`='"+type+"', `category_id`="+cat_id+" , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
    var rows = await db.asyncexecute(sql);
    return rows['insertId']
}

exports.addFeatureData = async function(feature_id, title){

    var sql = "INSERT INTO `feature_data` (`title`,`feature_id`, `lang_id`,`created_at` , `updated_at`) SELECT * FROM (SELECT '"+title+"',"+feature_id+" ,0"+config.lang_id+" ,'"+currentdate()+"' ,'"+currentdate()+":00') AS tmp WHERE NOT EXISTS ( SELECT `title`,`feature_id`,'lang_id' FROM `feature_data` WHERE `title`='"+title+"' and `feature_id`="+feature_id+" and lang_id = "+config.lang_id+" ) LIMIT 1"
    var cats = await db.asyncexecute(sql);
    return cats['insertId'];

    // var sql = "SELECT * FROM feature_data WHERE title='"+title+"' and `lang_id`="+config.lang_id+" and feature_id="+feature_id;
    // var rows = await db.asyncexecute(sql);
    // if(typeof rows[0] == 'undefined'){
    //     var sql = "INSERT INTO feature_data SET `title`='"+title+"', `feature_id`="+feature_id+" ,`lang_id`="+config.lang_id+" , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
    //     var rows = await db.asyncexecute(sql);
    //     return rows['insertId']

    // } return rows[0]['id'];
}

exports.getFeatureDataBytitle = async function(title){
    var sql = "SELECT * FROM feature_data WHERE title='"+title+"' and `lang_id`="+config.lang_id;
    var rows = await db.asyncexecute(sql);
    if(typeof rows[0] == 'undefined') return 0;
    else return rows[0]['feature_id'];
}

exports.addFeatureOption = async function(feature_id,property_id,related_feature_id=0){
    // var sql = "INSERT INTO `feature_options` (`feature_id`,`property_id`,`created_at` , `updated_at`) SELECT * FROM (SELECT '"+feature_id+"',0"+property_id+",'"+currentdate()+"' ,'"+currentdate()+":00') AS tmp WHERE NOT EXISTS ( SELECT `feature_id`,`property_id` FROM `feature_options` WHERE `feature_id`='"+feature_id+"' and `property_id`="+property_id+") LIMIT 1"
    // if(related_feature_id) var sql = "INSERT INTO `feature_options` (`feature_id`,`property_id`,`related_feature_id`,`created_at` , `updated_at`) SELECT * FROM (SELECT '"+feature_id+"',0"+property_id+",00"+related_feature_id+",'"+currentdate()+"' ,'"+currentdate()+":00') AS tmp WHERE NOT EXISTS ( SELECT `feature_id`,`property_id`,`related_feature_id` FROM `feature_options` WHERE `feature_id`='"+feature_id+"' and `property_id`="+property_id+" and `related_feature_id`="+related_feature_id+") LIMIT 1"
    // var cats = await db.asyncexecute(sql);
    // if(!cats['insertId']){
    //     var sql = "SELECT * FROM feature_options WHERE feature_id="+feature_id+" and property_id="+property_id;
    //     if(related_feature_id) sql += " and related_feature_id="+related_feature_id;
    //     var rows = await db.asyncexecute(sql);
    //     return rows[0]['id'];
    // }
    // return cats['insertId'];

    var sql = "INSERT INTO feature_options SET  `feature_id`="+feature_id+" ,`property_id`="+property_id+", `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
    if(related_feature_id)  sql += " , related_feature_id="+related_feature_id;
    var rows = await db.asyncexecute(sql);
    return rows['insertId']
}

exports.addFeatureOptionData = async function(feature_option_id, title ){
    // var sql = "INSERT INTO `feature_options_data` (`title`,`feature_option_id`,`lang_id`,`created_at` , `updated_at`) SELECT * FROM (SELECT '"+title+"',0"+feature_option_id+",00"+config.lang_id+",'"+currentdate()+"' ,'"+currentdate()+":00') AS tmp WHERE NOT EXISTS ( SELECT `title`,`feature_option_id`,`lang_id` FROM `feature_options_data` WHERE `title`='"+title+"' and `feature_option_id`="+feature_option_id+" and `lang_id`="+config.lang_id+") LIMIT 1"
    // var cats = await db.asyncexecute(sql);
    // return cats['insertId'];

    var sql = "SELECT * FROM feature_options_data WHERE title='"+title+"' and feature_option_id="+feature_option_id;
    var rows = await db.asyncexecute(sql);
    if(typeof rows[0] == 'undefined'){
        var sql = "INSERT INTO feature_options_data SET `title`='"+title+"', `feature_option_id`="+feature_option_id+" ,`lang_id`="+config.lang_id+" , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
        var rows = await db.asyncexecute(sql);
        return rows['insertId']

    }return rows[0]['id'];
}

exports.addPropertyFeature = async function(feature_id, property_id){
    var sql = "SELECT * FROM property_features WHERE feature_id="+feature_id+" and property_id="+property_id;
    var rows = await db.asyncexecute(sql);
    if(typeof rows[0] == 'undefined'){
        var sql = "INSERT INTO property_features SET `property_id`="+property_id+", `feature_id`="+feature_id+" , `created_at`='"+currentdate()+"' , `updated_at`='"+currentdate()+"'";
        var rows = await db.asyncexecute(sql);
        return rows['insertId']

    }return rows[0]['id'];
}

var gettype = function(type){
    if(type == 'bool') return 'checkbox';
    else if(type == 'int') return 'text';
    else if(type == 'float') return 'text';
    else if(type == 'string') return 'text';
    else return 'text';
}