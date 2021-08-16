var sFunction  =  require('./juniperStaticDataCtr');
const fs = require('fs');
var  cityModel = require('../../models/cities');
var  hotelModel = require('../../models/hotels');
var  Property = require('../../models/property');
var  facts = require('../../models/facts');
var basemodels = require('../../models/basemodels');
var config = require('../../config');
var excell = require('../../models/excell');

exports.updateCity = function(req,res,callback){   
    var citycallback = async function(cities){
        var provider = await cityModel.getProvider();
        if(!provider) return;
        for (var city of cities) {
            if(typeof city['Country'] != 'undefined'){
                var countryid =  await cityModel.getCountriesByName(city['Country'][0]['Name'][0]);
                var countryid = await cityModel.addcountry(countryid,city,provider);

                if(countryid){
                    var regionid = await cityModel.addRegion(countryid,city['Region'][0]["Name"][0],city['Region'][0]['$']['JPDCode'],provider);
                    await cityModel.addcity(city,regionid,countryid,provider);
                }
            }
        };
        callback('done');
    }
    getfiledata(req,res,citycallback);   
}

exports.updateHotelPortfolio = async function(req,res){
    var callback = async function(data){
        var provderid = await cityModel.getProvider();
        if(!provderid) return;
        for (var hotel of data) {
            await hotelModel.addHotelProtofilo(hotel,provderid);
        }
     }
    //  sFunction.hotelPortfolio(req,res,callback);
    getfiledataHotelupdate(req,res,callback);
}

exports.updateZoneList = async function(req,res){
    var callback = async function(data){
        var provderid = await cityModel.getProvider();
        if(!provderid) return;
        // var allairports = [];
        for await (var zone of data) {
            var type = zone['$']['AreaType'];
            if(type != 'CTY' && type != 'PAS' && type != 'REG' && typeof type != 'undefined'){
                var code = zone['$']['JPDCode'];
                var parentcode = zone['$']['ParentJPDCode'];
                var searchable = zone['$']['Searchable'];
                var name = zone['Name'][0];
                var cityid = await cityModel.getcityidByCode(parentcode,provderid);
                if(cityid){
                    if(type == 'ARP' && searchable){
                        name = name.replace(' Airport','');
                        var airportId = await Property.findAirportsByName(name);
                        // console.log(airportId,name);
                        if(airportId){
                            Property.findOrSaveProviderAirportCode(code,airportId,provderid);
                            // allairports.push([name,code]);
                        }
                    }else if(searchable){
                        await cityModel.addzone(cityid,name,code,provderid);
                    }
                }
            }
        }
        // excell.getExcelFile(allairports,res);
     }
    getfiledataZoneList(req,res,callback);
}

exports.updateHotelContent = async function(req,res,callback){
    var limitCallback = async function(limit,offset) {
        var provderid = await cityModel.getProvider();
        if(!provderid) return;
        var codes = await hotelModel.getHotelsCodes(provderid,limit,offset);
        //get hotel cities ids
        var cityids =[];
        var propertyids = [];
        codes.forEach(city => {
            cityids[city['code']] = city['city_id'];
            propertyids[city['code']] = city['p_id'];
        });

        var contentCallback = async function(err,hotels){
            for await (hotel of hotels){
                var code = hotel['$']['JPCode'];
                //add jotel zone
                var zone = hotel['Zone'][0];
                var zoneid = cityModel.findProviderZoneCode(zone['$']['JPDCode'],provderid);
                if(zoneid){
                    cityModel.findOrSaveZonePropertyIds(zoneid,propertyids[code]);
                }else{
                    var airport_id = Property.findProviderAirportCode(zone['$']['JPDCode'],provderid);
                    if(airport_id) Property.findOrSaveAirportsPropertyIds(airport_id,propertyids[code]);
                }
                
                //add hotel contacts
                var contact = typeof hotel['ContactInfo'] != 'undefined' ? hotel['ContactInfo'][0] : [];
                var phones = typeof contact['PhoneNumbers'] != 'undefined' ? contact['PhoneNumbers'][0]['PhoneNumber'] : [];
                phones.forEach(async phone => {await hotelModel.addContacts(propertyids[code],phone['_'],1) });
                var faxs = typeof contact['Faxes'] != 'undefined' ? contact['Faxes'][0]['Fax'] : [];
                faxs.forEach(async fax => {await hotelModel.addContacts(propertyids[code],fax['_'],2) });
                var emails = typeof contact['Emails'] != 'undefined' ? contact['Emails'][0]['Email'] : [];
                emails.forEach(async email => {await hotelModel.addContacts(propertyids[code],email['_'],3) });
                
                
                //save hotel images
                var images = typeof hotel['Images'] != 'undefined' ? hotel['Images'][0]['Image'] :[];
                for await (image of images){
                    var SaveImage = await Property.findOrSavePropertyImage(propertyids[code],image['FileName'][0],0,0,0);
                    if(SaveImage['inserted']) await hotelModel.download(propertyids[code],SaveImage['id'],image['FileName'][0]);
                };

                //add property descriptions
                var descriptions = typeof hotel['Descriptions'] != 'undefined' ? hotel['Descriptions'][0]['Description']: [];
                var longdesc = typeof descriptions[1] != 'undefined' ? descriptions[1]['_'] :''; 
                await Property.findOrSavePropertyDescription(propertyids[code],'General','JP100',longdesc,config.lang_id);


                //add features hotels
                var features = typeof hotel['Features'] != 'undefined' ? hotel['Features'][0]['Feature'] : [];
                for await (feature of features){
                    var catfeature = feature['$']['Type'];
                    var feature = feature['_'];
                    if(catfeature){
                        var catid = await facts.addFeaturecatregory(catfeature);
                        if(catid) await facts.addFeaturecatregoryData(catfeature,catid);
                    }

                    var featureid = await facts.addFeature(catid,'bool',feature);
                    if(featureid) await facts.addFeatureData(featureid,feature);

                    var feature_option_id = await facts.addFeatureOption(featureid,propertyids[code]);
                    if(catid) await facts.addFeatureOptionData(feature_option_id,true);
                };   
            
                var info = await Property.findPropertyInfoById(propertyids[code]);

                var infodata =  await Property.findPropertyInfoDataByPI(propertyids[code],config.lang_id);

                if(typeof info != 'undefined'){
                    //update property info and property info data
                    var stars = parseInt(hotel['HotelCategory'][0]['_']);
                    if(isNaN(stars)) stars = info['stars'];
                    var desc = typeof descriptions[0] != 'undefined' ? descriptions[0]['_'] :infodata['description'];
                    var _address = hotel['Address'][0];
                    var address = typeof _address['Address'] != 'undefined' ? _address['Address'][0] : infodata['address'];
                    var postalcode = typeof _address['PostalCode'] != 'undefined' ? _address['PostalCode'][0] : infodata['postal_code'];
                    var lat = typeof _address['Latitude'] != 'undefined' ? _address['Latitude'][0] :info['lat'];
                    var lon = typeof _address['Longitude'] != 'undefined' ? _address['Longitude'][0] :info['lon'];
                    var rooms = typeof hotel['JPRooms'] != 'undefined' ? hotel['JPRooms'][0]['JPRoom']:[];
                    
                    if(phones.length && !info['phone_number']) var phone = phones[0]['_'];
                    else var phone = info['phone_number'];
                    await Property.SavePropertyInfo(info['id'],info['country_id'],info['city_id'],info['region_id'],lat,lon,stars,rooms.length,0,phone);
                    
                    var title = typeof infodata['title'] != 'undefined' ? infodata['title'] : hotel['HotelName'][0];
                    var alternativeNames = typeof infodata['alternativeNames'] != 'undefined' ? infodata['alternativeNames'] : '';
                    var street = typeof infodata['street'] != 'undefined' ? infodata['street'] : '';

                    await Property.SavePropertyInfoData(infodata['id'],propertyids[code],title,alternativeNames,address,postalcode,street,desc,config.lang_id);            
                }
            };
            callback('done');
        }
        sFunction.hotelContent(req,res,codes,contentCallback);
    }
    getfiledataHotelupdateconten(limitCallback,24);
}

getfiledataHotelupdateconten = async function(callback,limit){
    const path ='contentcount.json';
    if (fs.existsSync(path)) {
        fs.readFile(path, 'utf8', async function(err, data) {
            var offset = JSON.parse(data)['offset'];
            offset += limit;
            callback(limit,offset);
            fs.writeFileSync(path, JSON.stringify({'offset':offset}));
        });
    }else{
        fs.writeFileSync(path, JSON.stringify({'offset':1}));
        callback(limit,1);
    }
}

getfiledataHotelupdate = async function(req,res, callback){
    const path ='hotelprotofolio.json';
    if (fs.existsSync(path)) {
        basemodels.readfile(path,callback,100)
    }else{
         var result=[];
         var callback = function(err,data){
             result = result.concat(data['Hotel']);
             console.log(result.length);
             if(typeof data['$'] != 'undefined'){
                 var token = data['$']['NextToken'];
                 console.log(token);
                 if(token) sFunction.hotelPortfolio(req,res,token,callback);
             }else {
                fs.writeFileSync(path, JSON.stringify({'err':err,'data':result}));
             }
         }
        sFunction.hotelPortfolio(req,res,'',callback);
    }
}

getfiledata = async function(req,res,callback){
    const path ='response.json';
    if (fs.existsSync(path)) {
       basemodels.readfile(path,callback,200)
    }else{
        var callback = function(err,data){
            fs.writeFileSync(path, JSON.stringify({err,data}));
         }
        sFunction.CityList(req,res,callback);
    }
}

getfiledataZoneList = async function(req,res,callback){
    const path ='zonelist.json';
    if (fs.existsSync(path)) {
       basemodels.readfile(path,callback,1000)
    }else{
        var callback = function(err,data){
            fs.writeFileSync(path, JSON.stringify({err,data}));
         }
        sFunction.zoneList(req,res,callback);
    }
}