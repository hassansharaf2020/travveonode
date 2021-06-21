var db = require('./db')
const utf8 = require('utf8');
const config = require('../config');
const { provider } = require('./hotels');

exports.getCountries = async function(){
    let rows  = await db.asyncexecute("SELECT * FROM `countries_data`");
    var result = [];
    rows.forEach(city => {
        result[city['name']] = city['id'];
    });
    return result;
}

exports.addcountry = async function(city){
    
    // city = '{"$":{"Id":"1","JPDCode":"JPD000003"},"Name":["Can Pastilla"],"Country":[{"$":{"Id":"118","JPDCode":"JPD034804"},"Name":["Spain"]}],"Region":[{"$":{"Id":"1953","JPDCode":"JPD036705"}}]}'
    // city = JSON.parse(city);
    //add new country
    let country  = await db.asyncexecute("INSERT INTO `countries` SET `code`=''");
    if(country){
        country_id = country['insertId'];
        // insert country data 
        let countrydata  = await db.asyncexecute("INSERT INTO `countries_data` SET `name`='"+city['Country'][0]['Name'][0] + "', `lang_id`='"+config.lang_id+"',`country_id`="+country_id);
        if(countrydata) {
            countryid = countrydata['insertId'];
            //get provider id
            provider = await db.asyncexecute("SELECT * FROM `providers` WHERE `code`='juniper'");

            //check if code and JPDCode exist if not add 
            code = await db.asyncexecute("SELECT * FROM `provider_country` WHERE `provider_id`="+provider[0]['id']+" and `country_id` = "+country_id+" and `code` ='"+city['Country'][0]['$']['Id']+"'");
            if(typeof code[0] == 'undefined')
                await db.asyncexecute("INSERT INTO `provider_country` SET `provider_id`="+provider[0]['id']+" , `country_id` = "+country_id+" , `code` ='"+city['Country'][0]['$']['Id']+"'")
            
            JPDCode = await db.asyncexecute("SELECT * FROM `provider_country` WHERE `provider_id`="+provider[0]['id']+" and `country_id` = "+country_id+" and `code` ='"+city['Country'][0]['$']['JPDCode']+"'");
            if(typeof JPDCode[0] == 'undefined')
                await db.asyncexecute("INSERT INTO `provider_country` SET `provider_id`="+provider[0]['id']+" , `country_id` = "+country_id+" , `code` ='"+city['Country'][0]['$']['JPDCode']+"'")
                
            return countryid
        }
        return 0;
    }
}

exports.addcity = async function(city,countryid){
    //add new country
    sql = 'SELECT * FROM `city_data` WHERE `name`="'+utf8.encode(city["Name"][0])+'"';
    let cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] == 'undefined'){
        citytable = await db.asyncexecute("INSERT INTO `cities` SET `country_id`="+countryid);
        if(citytable['insertId']){
            citydata = await db.asyncexecute('INSERT INTO `city_data` SET `lang_id`="'+config.lang_id+'" , `name`="'+utf8.encode(city["Name"][0])+'",`city_id`'+citytable['insertId']);
            id = citydata['insertId'];
        }else return 0;
    }else id = cityData[0]['city_id'];
   
     //get provider id
     provider = await db.asyncexecute("SELECT * FROM `providers` WHERE `code`='juniper'");

     //check if code and JPDCode exist if not add 
     code = await db.asyncexecute("SELECT * FROM `provider_city` WHERE `provider_id`="+provider[0]['id']+" and `city_id` = "+id+" and `code` ='"+city['$']['Id']+"'");
     if(typeof code[0] == 'undefined')
         await db.asyncexecute("INSERT INTO `provider_city` SET `provider_id`="+provider[0]['id']+" , `city_id` = "+id+" , `code` ='"+city['$']['Id']+"'")
     
     JPDCode = await db.asyncexecute("SELECT * FROM `provider_city` WHERE `provider_id`="+provider[0]['id']+" and `city_id` = "+id+" and `code` ='"+city['$']['JPDCode']+"'");
     if(typeof JPDCode[0] == 'undefined')
         await db.asyncexecute("INSERT INTO `provider_city` SET `provider_id`="+provider[0]['id']+" , `city_id` = "+id+" , `code` ='"+city['$']['JPDCode']+"'")
    return id;
}

exports.addRegion = async function(city,cityid){
    //add new country
    sql = 'SELECT * FROM `region_data` WHERE `title`="'+utf8.encode(city['Region'][0]["Name"][0])+'"';
    let regionData = await db.asyncexecute(sql);
    if(typeof regionData[0] == 'undefined'){
        ragiontable = await db.asyncexecute("INSERT INTO `regions` SET `city_id`="+cityid);
        if(ragiontable['insertId']){
            regiondata = await db.asyncexecute('INSERT INTO `region_data` SET `lang_id`="'+config.lang_id+'" , `title`="'+utf8.encode(city['Region'][0]["Name"][0])+'",`region_id`'+ragiontable['insertId']);
            id = regiondata['insertId'];
        } else return 0;
 
    }else id = regionData[0]['region_id'];
   
     //get provider id
     provider = await db.asyncexecute("SELECT * FROM `providers` WHERE `code`='juniper'");

     //check if code and JPDCode exist if not add 
     code = await db.asyncexecute("SELECT * FROM `provider_region` WHERE `provider_id`="+provider[0]['id']+" and `region_id` = "+id+" and `code` ='"+city['Region'][0]['$']['Id']+"'");
     if(typeof code[0] == 'undefined')
         await db.asyncexecute("INSERT INTO `provider_region` SET `provider_id`="+provider[0]['id']+" , `region_id` = "+id+" , `code` ='"+city['Region'][0]['$']['Id']+"'")
     
    return id;
}

exports.getcityid = async function(city,providerid){
    sql = 'SELECT * FROM `provider_city` WHERE `code`="'+city["$"]["JPDCode"]+'" and provider_id='+providerid;
    let cityData = await db.asyncexecute(sql);
    if(typeof cityData != 'undefined') return cityData[0]['city_id']
    else return 0;
}

exports.getcountrybycityid = async function(cityid){
    sql = 'SELECT * FROM `cities` WHERE `id`='+cityid;
    let cityData = await db.asyncexecute(sql);
    if(typeof cityData != 'undefined') return cityData[0]['country_id']
    else return 0;
}