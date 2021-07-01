var db = require('./db')
const utf8 = require('utf8');
const config = require('../config');
const cityModel = require('./cities');
const { currentdate } = require('./basemodels');

exports.addHotelProtofilo = async function(hotel,provider_id){
    //check if hotel exists
    let country  = await db.asyncexecute("SELECT * FROM `providers_property_codes` WHERE  `provider_id`="+provider_id+" and `code` = '"+hotel['$']['JPCode']+"'");
    
    if(typeof country[0] == 'undefined'){
        if(typeof hotel['City'] == 'undefined') return;
        var city_id = await cityModel.getcityid(hotel['City'][0],provider_id);
        if(!city_id) return;
        var countryid = await cityModel.getcountrybycityid(city_id);
        if(!countryid) return;

        //property_info
        sql = "INSERT INTO `property_info`(`city_id`, `country_id`, `stars`, `rooms_count`,  `channel_manager`, `lat`, `lon`) VALUES ("+city_id+","+countryid+",'"+hotel['HotelCategory'][0]['$']['code']+"','0',false,'"+hotel['Latitude'][0]+"','"+hotel['Longitude'][0]+"')";
        let propertyEntity  = await db.asyncexecute(sql);
        if(typeof propertyEntity != 'undefined') propertyEntityId = propertyEntity['insertId'];
        else return;

        //add property_info_data
        sql = 'INSERT INTO `property_info_data`(`property_id`, `title`, `address`, `address2`, `postal_code`,  `description`,created_at,updated_at) VALUES ('+propertyEntityId+',"'+hotel['Name'][0]+'","'+hotel['Address'][0]+'","","","","'+currentdate()+'","'+currentdate()+'")';
        let propertyDataEntity  = await db.asyncexecute(sql);
        if(typeof propertyDataEntity != 'undefined') propertyDataEntityId = propertyDataEntity['insertId'];
        else return;

        //checkif providers_property_codes exists
        sql = "SELECT * FROM `providers_property_codes` WHERE `provider_id`="+provider_id+" and `property_id`="+propertyEntityId+" and `code`='"+hotel['$']['JPCode']+"'";
        let property_codes  = await db.asyncexecute(sql);
        if(typeof property_codes[0] != 'undefined'){
            sql = "INSERT INTO `providers_property_codes` SET `provider_id`="+provider_id+",`property_id`="+propertyEntityId+",`code`='"+hotel['$']['JPCode']+"' , 'created_at'='"+currentdate()+"' ,  'updated_at'='"+currentdate()+"'";
            await db.asyncexecute(sql);
        }
        return propertyEntityId
    }else return 0;
}
