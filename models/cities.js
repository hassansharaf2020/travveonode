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

exports.getcityByname = async function(cityname,country_id,regionid=null){
    sql = 'SELECT * FROM `city_data` WHERE `name`="'+cityname+'"';
    var cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] == 'undefined'){
        citytable = await db.asyncexecute("INSERT INTO `cities` (region_id,country_id, created_at, updated_at) VALUES ("+regionid+","+country_id+",'"+currentdate()+"','"+currentdate()+"')");
        var city_id = citytable['insertId'];
        if(typeof citytable['insertId'] != 'undefined')
             await db.asyncexecute('INSERT INTO `city_data` (lang_id,name,city_id, created_at, updated_at) VALUES ("'+config.lang_id+'","'+cityname+'",'+city_id+',"'+currentdate()+'","'+currentdate()+'")');
        return city_id;
    }else return cityData[0]['city_id']
}

exports.getProvider =  async function(code= 'juniper'){
    var provider = await db.asyncexecute("SELECT * FROM `providers` WHERE `active` =1 and `code`='"+code+"'");
    if(typeof provider[0] == 'undefined') {console.log('provider not exists');return 0;}
    return provider[0]['id'];
}

exports.addcountry = async function(country_id,city,provider){
    if(! country_id){
        var country  = await db.asyncexecute("INSERT INTO `countries` (code, created_at, updated_at) VALUES ('','"+currentdate()+"','"+currentdate()+"')");
        if(typeof country['insertId'] != 'undefined'){
            country_id = country['insertId'];
            // insert country data 
            var countrydata  = await db.asyncexecute("INSERT INTO `countries_data` (name,lang_id,country_id, created_at, updated_at) VALUES ('"+ city['Country'][0]['Name'][0] + "','"+config.lang_id+"',"+country_id+",'"+currentdate()+"','"+currentdate()+"')" );
        }else return 0;
    }

    if(provider){
        //check if code and JPDCode exist if not add 
        var code = await db.asyncexecute("SELECT * FROM `provider_country` WHERE `provider_id`="+provider+" and `country_id` = "+country_id+" and `code` ='"+city['Country'][0]['$']['Id']+"'");
        if(typeof code[0] == 'undefined')
            await db.asyncexecute("INSERT INTO `provider_country` SET `provider_id`="+provider+" , `country_id` = "+country_id+" , `code` ='"+city['Country'][0]['$']['Id']+"'")
        
        var JPDCode = await db.asyncexecute("SELECT * FROM `provider_country` WHERE `provider_id`="+provider+" and `country_id` = "+country_id+" and `code` ='"+city['Country'][0]['$']['JPDCode']+"'");
        if(typeof JPDCode[0] == 'undefined')
            await db.asyncexecute("INSERT INTO `provider_country` SET `provider_id`="+provider+" , `country_id` = "+country_id+" , `code` ='"+city['Country'][0]['$']['JPDCode']+"'")
    }
    return country_id
}

// exports.addDestinaions = async function(countryid,cityid,name,code){
//      //add new country
//      sql = 'SELECT * FROM `governates` WHERE `code`='+code;
//      var goverData = await db.asyncexecute(sql);
//      if(typeof goverData[0] == 'undefined'){
//          govertable = await db.asyncexecute("INSERT INTO `governates` (country_id,code, created_at, updated_at) VALUES ("+countryid+","+code+",'"+currentdate()+"','"+currentdate()+"')");
//          if(typeof govertable['insertId'] != 'undefined'){
//              var gover_id = govertable['insertId'];
//              await db.asyncexecute('INSERT INTO `governates_data` (lang_id,name,governate_id, created_at, updated_at) VALUES ("'+config.lang_id+'","'+name+'",'+gover_id+',"'+currentdate()+'","'+currentdate()+'")');
//          }else return 0;
//      }else var gover_id = goverData[0]['id'];
//      await db.asyncexecute('UPDATE `cities` SET governate_id="'+gover_id+'" , updated_at="'+currentdate()+'" WHERE id='+cityid);

//      return gover_id;
// }

exports.addcity =  async function(city,regionid,countryid,provider){
    //add new country
    var cityname = city["Name"][0].replace(/"/g,"'");
    sql = 'SELECT * FROM `city_data` WHERE `name`="'+cityname+'"';
    var cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] == 'undefined'){
        citytable = await db.asyncexecute("INSERT INTO `cities` (region_id,country_id, created_at, updated_at) VALUES ("+regionid+","+countryid+",'"+currentdate()+"','"+currentdate()+"')");
        if(typeof citytable['insertId'] != 'undefined'){
            var city_id = citytable['insertId'];
            citydata = await db.asyncexecute('INSERT INTO `city_data` (lang_id,name,city_id, created_at, updated_at) VALUES ("'+config.lang_id+'","'+cityname+'",'+citytable['insertId']+',"'+currentdate()+'","'+currentdate()+'")');
        }else return 0;
    }else var city_id = cityData[0]['city_id'];

    //check if code and JPDCode exist if not add 
    var code = await db.asyncexecute("SELECT * FROM `provider_city` WHERE `provider_id`="+provider+" and `city_id` = "+city_id+" and `code` ='"+city['$']['Id']+"'");
    if(typeof code[0] == 'undefined')
        await db.asyncexecute("INSERT INTO `provider_city` (provider_id,city_id,code) VALUES ("+provider+","+city_id+",'"+city['$']['Id']+"')");
    
    var JPDCode = await db.asyncexecute("SELECT * FROM `provider_city` WHERE `provider_id`="+provider+" and `city_id` = "+city_id+" and `code` ='"+city['$']['JPDCode']+"'");
    if(typeof JPDCode[0] == 'undefined')
        await db.asyncexecute("INSERT INTO `provider_city` (provider_id,city_id,code) VALUES ("+provider+","+city_id+",'"+city['$']['JPDCode']+"')");
    return city_id;
}

exports.addRegion = async function(country_id,regionName,regioncode,provider){
    //add new country
    var sql = 'SELECT * FROM `region_data` WHERE `title`="'+regionName+'"';
    let regionData = await db.asyncexecute(sql);
    if(typeof regionData[0] == 'undefined'){
        ragiontable = await db.asyncexecute("INSERT INTO regions (country_id, created_at, updated_at) VALUES ("+country_id+",'"+currentdate()+"','"+currentdate()+"')");
        if(ragiontable['insertId']){
            regiondata = await db.asyncexecute('INSERT INTO `region_data` SET `lang_id`="'+config.lang_id+'" , `title`="'+regionName+'",`region_id`='+ragiontable['insertId']+',`created_at`="'+currentdate()+'",`updated_at`="'+currentdate()+'"');
            var region_id = ragiontable['insertId'];
        } else return 0;
 
    }else var region_id = regionData[0]['region_id'];
     //check if code and JPDCode exist if not add 
     var code = await db.asyncexecute("SELECT * FROM `provider_region` WHERE `provider_id`="+provider+" and `region_id` = "+region_id+" and `code` ='"+regioncode+"'");
     if(typeof code[0] == 'undefined' && typeof region_id != 'undefined' )
         await db.asyncexecute("INSERT INTO `provider_region` SET `provider_id`="+provider+" , `region_id` = "+region_id+" , `code` ='"+regioncode+"'")
     
    return region_id;
}

exports.addzone = async function(city_id,name,zonecode,provider){
    var sql = 'SELECT * FROM `zone_data` WHERE `name`="'+name+'"';
    let zoneData = await db.asyncexecute(sql);
    if(typeof zoneData[0] == 'undefined'){
        zonetable = await db.asyncexecute("INSERT INTO zones (city_id, created_at, updated_at) VALUES ("+city_id+",'"+currentdate()+"','"+currentdate()+"')");
        if(zonetable['insertId']){
            zonedata = await db.asyncexecute('INSERT INTO `zone_data` SET `lang_id`="'+config.lang_id+'" , `name`="'+name+'",`zone_id`='+zonetable['insertId']+',`created_at`="'+currentdate()+'",`updated_at`="'+currentdate()+'"');
            var zone_id = zonetable['insertId'];
        } else return 0;
    }else var zone_id = zoneData[0]['zone_id'];

     //check if code and JPDCode exist if not add 
    var code = await db.asyncexecute("SELECT * FROM `provider_zone_code` WHERE `provider_id`="+provider+" and `zone_id` = "+zone_id+" and `code` ='"+zonecode+"'");
    if(typeof code[0] == 'undefined' && typeof zone_id != 'undefined' )
        await db.asyncexecute("INSERT INTO `provider_zone_code` SET `provider_id`="+provider+" , `zone_id` = "+zone_id+" , `code` ='"+zonecode+"'")
     
    return zone_id;
}

exports.findProviderZoneCode =  async function(zonecode,provider){
    var code = await db.asyncexecute("SELECT * FROM `provider_zone_code` WHERE `provider_id`="+provider+" and `code` ='"+zonecode+"'");
    return typeof code[0] != 'undefined' ? code[0]['zone_id'] :  0;
  }

exports.findOrSaveZonePropertyIds=  async function(zone_id,propertyid){
    var rows = await db.asyncexecute("SELECT * FROM `property_zone` where `zone_id`="+zone_id+" and `property_id`="+propertyid);
    if(typeof rows[0] == 'undefined'){
        sql  = "INSERT INTO `property_zone` SET `zone_id`="+zone_id+" , `property_id`="+propertyid;
        var rows = await db.asyncexecute(sql);
    }
}

exports.getcityidByCode = async function(citycode,providerid){
    sql = 'SELECT * FROM `provider_city` WHERE `code`="'+citycode+'" and provider_id='+providerid;
    var cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] != 'undefined') return cityData[0]['city_id']
    else return 0;
}

exports.getcityCodeByid = async function(cityid,providerid){
    sql = 'SELECT * FROM `provider_city`  WHERE `city_id`="'+cityid+'" and provider_id='+providerid;
    var cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] != 'undefined'){
        return cityData[0]['code'].includes('JPD') ? cityData[0]['code'] : cityData[1]['code'] 
    } else return 0;
}

exports.getcountrybycityid = async function(cityid){
    sql = 'SELECT * FROM `cities` WHERE `id`='+cityid;
    let cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] != 'undefined') return cityData[0]['country_id']
    else return 0;
}

exports.getcountryCodebycityid = async function(cityid){
    sql = 'SELECT countries.code FROM `cities` JOIN countries WHERE cities.country_id = countries.id and cities.id='+cityid;
    let cityData = await db.asyncexecute(sql);
    if(typeof cityData[0] != 'undefined') return cityData[0]['code']
    else return 0;
}