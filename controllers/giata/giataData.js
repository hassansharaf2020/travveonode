var basemodels = require('../../models/basemodels');
const fs = require('fs');
const Property = require('../../models/property');
const cityModel = require('../../models/cities');
const factsModel = require('../../models/facts');
const path = require("path");
const { lang_id } = require('../../config');

//get startInfoService
exports.startInfoService = async function(req,res,callback){
  async function startInfoServiceCallback (items){
    var prividerid = await cityModel.getProvider('giata');
      for await (var item of items) {
      link = item['$']["xlink:href"];
      // basemodels.giataRequest([] , saveInfoServiceCallback , link);
      var data = await basemodels.giataAwaitRequest([], link);
      // basemodels.sleep(100);
      await saveInfoService([],data,prividerid);
    };
    return callback('response') ;
  }
  getfilestartInfoService(res,req,startInfoServiceCallback)
}


var saveInfoService = async function(error,res,prividerid){
  if(typeof res['result'] == 'undefined') return;
  var giataId = res['result']['item'][0]['$']['giataId'];
  var property =  await Property.findPropertyCodeId(prividerid,giataId);
  if(typeof property == 'undefined'){
    var property_id = await Property.addPropertyInfo(res['result']['item'][0]['country'][0],res['result']['item'][0]['city'][0]);
    await Property.addPropertyCode(prividerid,property_id,giataId);
  }else var property_id = property['property_id']

  // parseImage(property_id, res['result']['item'][0]['images'])

  // ParseText(res['result']['item'][0]['texts'],prividerid);

  await ParseFactsheet(res['result']['item'][0]['factsheet'],property_id);
}

ParseFactsheet = async function(factsheet,property_id){
  if(typeof factsheet == 'undefined') return;
  for await (var item of factsheet) {
    var link =  item['$']['xlink:href'];
    var data = await basemodels.giataAwaitRequest([] , link);
      if(data['result'] == 'undefined') return;
      var sections = data['result']['item'][0]['factsheet'][0]['sections'][0]['section'];
      for await (let section of sections) {
        var name = section['$']['name'];
        var cat_id = await factsModel.getFeatureCatregoryDataBytitle(name);
        if(! cat_id){
          var cat_id = await factsModel.addFeaturecatregory();
          await factsModel.addFeaturecatregoryData(name,cat_id);
        }
        var facts = section['facts'][0]['fact'];
        for await (let fact of facts) {
          var fact_id = fact['$']['id'];
          var fact_name = fact['$']['name'];
          var typeHint = fact['$']['typeHint'];
          var value = fact['value'][0];
          
          await _addFeatureAndFeatureOptionData(cat_id,fact_name,typeHint,value,property_id);

          /* old code
          var factexists = await Property.getPropertyFactsByFactid(fact_id);
          if(!factexists){
            await Property.addPropertyFacts(property_id,type,name,fact_id,fact_name,typeHint,value);
          }
          */

        };
      };    
    }
}

var _addFeatureAndFeatureOptionData = async function(cat_id,fact_name,typeHint,fact_value,property_id){
  //getfeature id 
  var feature_id = await factsModel.getFeatureDataBytitle(fact_name);
  if(!feature_id){
    //add feature and feature data
    var feature_id  =  await factsModel.addFeature(cat_id,typeHint);
    await factsModel.addFeatureData(feature_id,fact_name);
  }

  if(typeof fact_value == 'object'){

    var value = fact_value['_'];
    if(fact_value['$']['name'] == 'distance') value += fact_value['$']['unit'];
    var related_feature_id = await factsModel.addFeatureOption(feature_id,property_id);
    await factsModel.addFeatureOptionData(related_feature_id,value);

    // add feature option and feature option data
    if(fact_value['$']['fee'] != 'undefined') var value='fee';
    else if(fact_value['$']['name'] != 'undefined') var value = fact_value['$']['name'];
    var option_id =await factsModel.addFeatureOption(feature_id,property_id,related_feature_id);
    await factsModel.addFeatureOptionData(option_id,value);

    
  }else{
    // add feature option and feature option data
    var option_id = await factsModel.addFeatureOption(feature_id,property_id);
    await factsModel.addFeatureOptionData(option_id,fact_value);
  }
}

ParseText = async function(texts,prividerid){
  if(typeof texts == 'undefined') return;
  var downloadText = async function(data,langid){
    if(data['result'] == 'undefined') return;
    var giataId = data['result']['item'][0]['$']['giataId'];
    var allsections = data['result']['item'][0]['texts'][0]['text'][0]['sections'];
    var property =  await Property.findPropertyCodeId(prividerid,giataId);
    if(typeof property != 'undefined'){
      for (var sections of allsections) {
        for (var section of sections['section']) {
          var _code = section['$']['type'];
          var _title = section['title'][0];
          var _para = section['para'][0];
          await Property.findOrSavePropertyDescription(property['property_id'],_title,_code,_para,langid)
        };
      };
    }
  }
  for (var text of texts) {
    for (var item of text['text']) {
      var link =  item['$']['xlink:href'];
      var langid = await checkLangId(item['$']['lang']);
      if(langid){
        var ParsetextCallback = function(res,data){
          downloadText(data,langid);
        }
        basemodels.giataRequest([] , ParsetextCallback , link);
      }
    };
  };
}

parseImage = async function(propertyId, images){
 if(typeof images == 'undefined') return;
 for (var image of images) {
  for (var sizes of image['image']) {
    for (var size of sizes['sizes'][0]['size']) {
        var link = size['$']['xlink:href'];
        var width= size['$']['width'];
        var height= size['$']['height'];
        var filesize = size['$']['filesize'];
        var SaveImage = await Property.findOrSavePropertyImage(propertyId,link,width,height,filesize);
        if(SaveImage['inserted']) downloadimage(propertyId,SaveImage['id'],link);
      };
    };
  };
}

downloadimage = function(propertyId,imageid,link){
  var targetPath = path.join(__dirname, "../../public/uploads/property");
  if (!fs.existsSync(targetPath)){
    fs.mkdirSync(targetPath);
  }

  var targetPath = path.join(targetPath,propertyId.toString());
  if (!fs.existsSync(targetPath)){
    fs.mkdirSync(targetPath);
  }

  var targetPath = path.join(targetPath,imageid.toString());
  if (!fs.existsSync(targetPath)){
    basemodels.giatadownloadimageRequest(link,targetPath+'.jpg');
  }
}


getfilestartInfoService = async function(req,res, readcallback){
  const _path ='startInfoService.json';
  if (fs.existsSync(_path)) {
    basemodels.readfile(_path,readcallback,10);
  }else{
      var callback = function(err,data){
          var data =  data['result']['items'][0]['item'];
          fs.writeFileSync(_path, JSON.stringify({err,data}));
       }
       basemodels.giataRequest([] , callback);
  }
}

/*
* 
*
*  MultipeCodesService
*
**
*/

//get startMultipeCodesService
exports.startMultipeCodesService = async function(req,res,callback){
  async function startMultipeCodesServiceCallback (items){
    var prividerid = await cityModel.getProvider('giata');
    // console.log(items);
    var MultipeCodesServiceCallback = function(error,res){
      if(typeof res['properties'] != 'undefined')
        parseProperty(res['properties']['property'],prividerid);
    }
    for (var item of items) {
      link = item['$']["xlink:href"];
      basemodels.giataRequest([] , MultipeCodesServiceCallback , link);
    };
    return callback('response') ;
  }
  getfilestartMultipeCodesService(res,req,startMultipeCodesServiceCallback)
}

parseProperty = async function(properties,prividerid){
  for (var property of properties) {
    var giataId = property['$']['giataId'];
    var propertyCode = await Property.findPropertyCodeId(prividerid,giataId);
    var country_id = await cityModel.getCountriesByCode(property['country'][0]);
    var city_id = await cityModel.getcityByname(property['city'][0]['_'],country_id);
    var airports = parseItems(typeof property['airports'] != 'undefined' ? property['airports'][0]['airport'] : []);
    var ratings = parseItems(typeof property['ratings'] != 'undefined' ? property['ratings'][0]['rating'] : []);
    var latLon = typeof property['geoCodes'] != 'undefined' ? property['geoCodes'][0]['geoCode'][0] : 'undefined';
    if(typeof latLon != 'undefined'){
      var lat = latLon['latitude'][0];
      var lon = latLon['longitude'][0];
    }else {
      var lat = 0;var lon = 0;
    }
    var category_id = property['category'] !='undefined' ? property['category'][0] : 0;
    var stars = typeof property['ratings'] !='undefined' ? property['ratings'][0]['rating'][0]['$']['value'] : '';
    var rooms_count = 0;
    var channel_manager = false;

    // console.log(id,country_id,city_id,airports,ratings,lat,lon,category_id,stars,rooms_count,channel_manager);
 
    if(typeof propertyCode != 'undefined') propertyid= propertyCode['property_id'];
    else propertyid=0;
    var newpropertyid = await Property.SavePropertyInfo(propertyid,country_id,city_id,airports,ratings,lat,lon,category_id,stars,rooms_count,channel_manager);
    
    if(!propertyid) Property.addPropertyCode(prividerid,newpropertyid,giataId);

    savePropertyData(newpropertyid,property);
    savePhone(newpropertyid,property);
    saveEmail(newpropertyid,property);
    saveWebsite(newpropertyid,property);
    saveProviderCodes(newpropertyid,property);
    saveProviderChains(newpropertyid,property,prividerid);
  };
}

var parseItems = function(items){
  var result = [];
  for (var item of items) {
    result.push(item['$']); 
  };
  return JSON.stringify(result);
}
var parseAddress = function(property){
  var result = [];
  if(typeof property['addresses'] == 'undefined') return [];
  var addresses = property['addresses'][0]['address'][0];
  result['street'] = typeof addresses['street'] != 'undefined' ? addresses['street'][0] : '';
  result['postal_code'] = typeof addresses['postal_code'] != 'undefined' ? addresses['postal_code'][0] : '';
  var addressline = '';
  var i=1;
  for (var line of addresses['addressLine']) {
    if(i != 1) addressline += ' , ';
    addressline += line['_'];
    i++;
  };
  result['addressline'] = addressline;
  return result;
}

var savePhone = async function(propertyid , property){
  var phones = typeof property['phones'] !='undefined' ? property['phones'][0]['phone'] : [];
  for (var phone of phones) {
    var type = phone['$']['tech'];
    var phone = phone['_'];
    var type_id = await Property.findOrSavePropertyContactType(type,lang_id);
    await Property.findOrSavePropertyContact(type_id,phone,propertyid);
  };
}

var saveEmail = async function(propertyid , property){
  var emails = typeof property['emails'] !='undefined' ? property['emails'][0]['email'] : [];
  var type_id = await Property.findOrSavePropertyContactType('email',lang_id);
  for (var email of emails) {
    await Property.findOrSavePropertyContact(type_id,email,propertyid);
  };
}

var saveWebsite = async function(propertyid , property){
  var websites = typeof property['websites'] !='undefined' ? property['websites'][0]['website'] : [];
  var type_id = await Property.findOrSavePropertyContactType('website',lang_id);
  for (var website of websites) {
    await Property.findOrSavePropertyContact(type_id,website,propertyid);
  };
}

var saveProviderCodes = async function(propertyid , property){
  var providerType = await Property.providerTypeId('service');
  var propertyCodes = typeof property['propertyCodes'] != 'undefined' ? property['propertyCodes'][0]['provider'] :[];
  for (var codes of propertyCodes) {
    var providerCode = codes['$']['providerCode'];
    var providerid = await Property.findOrSaveProviders(providerCode,providerType);
    for (var code of codes['code']) {
      var _code = code['value'][0];
      if(typeof _code == "string")
       await Property.findOrSaveProvidersPropertyCodes(providerid,propertyid,_code);
    };
  };
}

var saveProviderChains = async function(propertyid , property, prividerid){
  var chains = typeof property['chains'] != 'undefined' ? property['chains'][0]['chain'] :[];
  for (var chain of chains) {
    var name = chain['$']['chainName'];
    var code = chain['$']['chainId'];
    
    await Property.findOrSavePropertyChainMaster(code);
    var chainId = await Property.findOrSavePropertyChainData(name,lang_id,code);
    await Property.findOrSavePropertyChain(chainId,propertyid);
    await Property.findOrSaveProviderPropertyChain(prividerid,code,chainId)
  };
}




var savePropertyData =  async function(propertyid , property){
  var propertyInfoDataID =  await Property.findPropertyInfoDataByPI(propertyid);
  var title = property['name'][0] ?? '';
  var destination = property['destination'][0]['_'] ?? '';
  var alternativeNames = typeof property['alternativeNames'] != 'undefined' ? property['alternativeNames'][0]['alternativeName'][0]['_'] : '';
  var addresses = parseAddress(property);
  var address = addresses['addressline'];
  var postal_code = addresses['postal_code'];
  var street = addresses['street'];
  Property.SavePropertyInfoData(propertyInfoDataID,propertyid,title,destination,alternativeNames,address,postal_code,street,lang_id);
}

getfilestartMultipeCodesService = async function(req,res, readcallback){
  const _path ='startMultipeCodesService.json';
  if (fs.existsSync(_path)) {
    basemodels.readfile(_path,readcallback,10);
  }else{
      var callback = function(err,data){
          var data =  data['properties']['property'];
          fs.writeFileSync(_path, JSON.stringify({err,data}));
       }
       basemodels.giataRequest([] , callback,'http://multicodes.giatamedia.com/webservice/rest/1.latest/properties/');
  }
}

checkLangId = async function(code){
  if(code == 'en' ) return 1;
  if(code == 'ar' ) return 2;

  return await basemodels.checklanguage(code);
}