var db = require('./db')
// const utf8 = require('utf8');
const config = require('../config');
const { currentdate } = require('./basemodels');

exports.getCountries =  async function(){
        var rows = await db.asyncexecute("SELECT * FROM `countries_data`;");
        var result = [];
        rows.forEach(city => {
            result[city['name']] = city['id'];
        });
        return result 
}

exports.getCountriesByName =  async function(name){
    var rows = await db.asyncexecute("SELECT * FROM `countries_data` where name='"+name+"'");
    if(typeof rows[0] == 'undefined') return 0;
    return rows[0]['country_id'];
}


exports.getCountriesByCode =  async function(code){
    var rows = await db.asyncexecute("SELECT * FROM `countries` where code='"+code+"'");
    if(typeof rows[0] == 'undefined'){
        var country  = await db.asyncexecute("INSERT INTO `countries` (code, created_at, updated_at) VALUES ('"+code+"','"+currentdate()+"','"+currentdate()+"')");
        var country_id = country['insertId'];
        if(typeof country['insertId'] != 'undefined')
            await db.asyncexecute("INSERT INTO `countries_data` (name,lang_id,country_id, created_at, updated_at) VALUES ('"+ code + "','"+config.lang_id+"',"+country_id+",'"+currentdate()+"','"+currentdate()+"')" );
        return country_id;     
    }else return rows[0]['id'];
}

exports.getcityByname = async function(cityname,country_id){
    sql = 'SELECT * FROM `city_data` WHERE `name`="'+cityname+'"';
    var cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] == 'undefined'){
        citytable = await db.asyncexecute("INSERT INTO `cities` (country_id, created_at, updated_at) VALUES ("+country_id+",'"+currentdate()+"','"+currentdate()+"')");
        var city_id = citytable['insertId'];
        if(typeof citytable['insertId'] != 'undefined')
             await db.asyncexecute('INSERT INTO `city_data` (lang_id,name,city_id, created_at, updated_at) VALUES ("'+config.lang_id+'","'+cityname+'",'+city_id+',"'+currentdate()+'","'+currentdate()+'")');
        return city_id;
    }else return cityData[0]['city_id']
}

exports.getProvider =  async function(code= 'juniper'){
    var provider = await db.asyncexecute("SELECT * FROM `providers` WHERE `code`='"+code+"'");
    if(typeof provider[0] == 'undefined') {console.log('provider not exists');return 0;}
    return provider[0]['id'];
}

exports.addcountry = async function(city,provider){
    var country  = await db.asyncexecute("INSERT INTO `countries` (code, created_at, updated_at) VALUES ('','"+currentdate()+"','"+currentdate()+"')");
    if(typeof country['insertId'] != 'undefined'){
        country_id = country['insertId'];
        // insert country data 
        var countrydata  = await db.asyncexecute("INSERT INTO `countries_data` (name,lang_id,country_id, created_at, updated_at) VALUES ('"+ city['Country'][0]['Name'][0] + "','"+config.lang_id+"',"+country_id+",'"+currentdate()+"','"+currentdate()+"')" );
        if(countrydata['insertId'] != 'undefined') {
            countryid = countrydata['insertId'];
            if(provider){
            //check if code and JPDCode exist if not add 
            code = await db.asyncexecute("SELECT * FROM `provider_country` WHERE `provider_id`="+provider+" and `country_id` = "+country_id+" and `code` ='"+city['Country'][0]['$']['Id']+"'");
            if(typeof code[0] == 'undefined')
                await db.asyncexecute("INSERT INTO `provider_country` SET `provider_id`="+provider+" , `country_id` = "+country_id+" , `code` ='"+city['Country'][0]['$']['Id']+"'")
            
            JPDCode = await db.asyncexecute("SELECT * FROM `provider_country` WHERE `provider_id`="+provider+" and `country_id` = "+country_id+" and `code` ='"+city['Country'][0]['$']['JPDCode']+"'");
            if(typeof JPDCode[0] == 'undefined')
                await db.asyncexecute("INSERT INTO `provider_country` SET `provider_id`="+provider+" , `country_id` = "+country_id+" , `code` ='"+city['Country'][0]['$']['JPDCode']+"'")
            }
            return country_id
        }
        return 0;
    }else return 0;
}

exports.addcity =  async function(city,countryid,provider){
    //add new country
    sql = 'SELECT * FROM `city_data` WHERE `name`="'+city["Name"][0]+'"';
    var cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] == 'undefined'){
        citytable = await db.asyncexecute("INSERT INTO `cities` (country_id, created_at, updated_at) VALUES ("+countryid+",'"+currentdate()+"','"+currentdate()+"')");
        if(typeof citytable['insertId'] != 'undefined'){
            var city_id = citytable['insertId'];
            citydata = await db.asyncexecute('INSERT INTO `city_data` (lang_id,name,city_id, created_at, updated_at) VALUES ("'+config.lang_id+'","'+city["Name"][0]+'",'+citytable['insertId']+',"'+currentdate()+'","'+currentdate()+'")');
        }else return 0;
    }else var city_id = cityData[0]['city_id'];

    //check if code and JPDCode exist if not add 
    code = await db.asyncexecute("SELECT * FROM `provider_city` WHERE `provider_id`="+provider+" and `city_id` = "+city_id+" and `code` ='"+city['$']['Id']+"'");
    if(typeof code[0] == 'undefined')
        await db.asyncexecute("INSERT INTO `provider_city` (provider_id,city_id,code) VALUES ("+provider+","+city_id+",'"+city['$']['Id']+"')");
    
    JPDCode = await db.asyncexecute("SELECT * FROM `provider_city` WHERE `provider_id`="+provider+" and `city_id` = "+city_id+" and `code` ='"+city['$']['JPDCode']+"'");
    if(typeof JPDCode[0] == 'undefined')
        await db.asyncexecute("INSERT INTO `provider_city` (provider_id,city_id,code) VALUES ("+provider+","+city_id+",'"+city['$']['JPDCode']+"')");
    return city_id;
}

exports.addRegion = async function(city,cityid,provider){
    //add new country
    sql = 'SELECT * FROM `region_data` WHERE `title`="'+city['Region'][0]["Name"][0]+'"';
    let regionData = await db.asyncexecute(sql);
    if(typeof regionData[0] == 'undefined'){
        ragiontable = await db.asyncexecute("INSERT INTO regions (city_id, created_at, updated_at) VALUES ("+cityid+",'"+currentdate()+"','"+currentdate()+"')");
        if(ragiontable['insertId']){
            regiondata = await db.asyncexecute('INSERT INTO `region_data` SET `lang_id`="'+config.lang_id+'" , `title`="'+city['Region'][0]["Name"][0]+'",`region_id`='+ragiontable['insertId']+',`created_at`="'+currentdate()+'",`updated_at`="'+currentdate()+'"');
            var region_id = regiondata['insertId'];
        } else return 0;
 
    }else var region_id = regionData[0]['region_id'];
     //check if code and JPDCode exist if not add 
     code = await db.asyncexecute("SELECT * FROM `provider_region` WHERE `provider_id`="+provider+" and `region_id` = "+region_id+" and `code` ='"+city['Region'][0]['$']['Id']+"'");
     if(typeof code[0] == 'undefined' && typeof id != 'undefined' )
         await db.asyncexecute("INSERT INTO `provider_region` SET `provider_id`="+provider+" , `region_id` = "+region_id+" , `code` ='"+city['Region'][0]['$']['Id']+"'")
     
    return region_id;
}

exports.getcityid = async function(city,providerid){
    sql = 'SELECT * FROM `provider_city` WHERE `code`="'+city["$"]["JPDCode"]+'" and provider_id='+providerid;
    var cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] != 'undefined') return cityData[0]['city_id']
    else return 0;
}

exports.getcountrybycityid = async function(cityid){
    sql = 'SELECT * FROM `cities` WHERE `id`='+cityid;
    let cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] != 'undefined') return cityData[0]['country_id']
    else return 0;
}