var db = require('./db')
const utf8 = require('utf8');
const config = require('../config');
const cityModel = require('./cities');
var fs = require('fs'), request = require("request");
const { currentdate } = require('./basemodels');
var  Property = require('./property');
var sizeOf = require('image-size');
const path = require("path");

exports.addHotelProtofilo = async function(hotel,provider_id){
    if(!hotel) return;
    //check if hotel exists
    let country  = await db.asyncexecute("SELECT * FROM `providers_property_codes` WHERE  `provider_id`="+provider_id+" and `code` = '"+hotel['$']['JPCode']+"'");
    
    if(typeof country[0] == 'undefined'){
        if(typeof hotel['City'] == 'undefined') return;
        var city_id = await cityModel.getcityidByCode(hotel['City'][0]["$"]["JPDCode"],provider_id);
        if(!city_id) return;
        var countryid = await cityModel.getcountrybycityid(city_id);
        if(!countryid) return;
        var regionid = await cityModel.addRegion(countryid,hotel['Zone'][0]['Name'][0],hotel['Zone'][0]['$']['JPDCode'],provider_id) 

        var starts = typeof hotel['HotelCategory'][0]['$'] != 'undefined' ? hotel['HotelCategory'][0]['$']['Code'] : 0;
        //property_info
        var propertyEntityId = await Property.SavePropertyInfo(0,countryid,city_id,regionid,hotel['Latitude'][0],hotel['Longitude'][0],starts,0,0,'');
        //add property_info_data
        var zipcode = typeof hotel['ZipCode'] != 'undefined' ? hotel['ZipCode'][0] : '';
        await Property.SavePropertyInfoData(0,propertyEntityId,hotel['Name'][0],'',hotel['Address'][0],zipcode,'','',config.lang_id);
        //checkif providers_property_codes exists
        await Property.findOrSaveProvidersPropertyCodes(provider_id,propertyEntityId,hotel['$']['JPCode']);
    
        return propertyEntityId
    }else return 0;
}

exports.getHotelsCodes= async function(provider_id,limit,offset){
    //check if hotel exists
    let code  = await db.asyncexecute("SELECT ppc.code,pi.city_id,ppc.property_id as p_id FROM `providers_property_codes` as ppc JOIN `property_info` as pi WHERE ppc.property_id = pi.id and ppc.`provider_id`="+provider_id+" limit "+limit+" offset "+offset);
    return code;
}

exports.addContacts = async function(property_id,phone,type){
    let contact  = await db.asyncexecute("SELECT * FROM `property_contacts` WHERE  `property_id`="+property_id+" and `phone` = '"+phone+"' and `type_id` = '"+type+"'");
    if(typeof contact[0] == 'undefined'){
        await db.asyncexecute("INSERT INTO `property_contacts` SET  `property_id`="+property_id+" , `phone` = '"+phone+"' , `type_id` = '"+type+"' , `priority` =1 ,`created_at`='"+currentdate()+"',`updated_at`='"+currentdate()+"'");
    }
}

exports.download = async function(propertyId,imageid,link){
    if(config.env == 'live') var targetPath = path.join(__dirname, "../../public_html/public/uploads/property");
    else var targetPath = path.join(__dirname, "../../public_html/public/uploads/property");
    
    if (!fs.existsSync(targetPath)){
      fs.mkdirSync(targetPath);
    }
    var targetPath = path.join(targetPath,propertyId.toString());
    if (!fs.existsSync(targetPath)){
      fs.mkdirSync(targetPath);
    }
  
    var targetPath = path.join(targetPath,imageid.toString()+'.jpg');
    if (!fs.existsSync(targetPath)){
        request(link).pipe(fs.createWriteStream(targetPath)).on('error', function(e){console.log(e);}).on('close', function(){
            // var dimensions = sizeOf(targetPath);
            sizeOf(targetPath, async function (err, dimensions) {
                if(typeof dimensions != 'undefined') await Property.updatePropertyImage(imageid,dimensions.width,dimensions.height,0);
                else{
                    await Property.DeletePropertyImage(imageid);
                    fs.unlink(targetPath,function(){});
                }
            });
        });
    }
};