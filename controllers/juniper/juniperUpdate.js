var sFunction  =  require('./juniperStaticDataCtr');
const fs = require('fs');
var  cityModel = require('../../models/cities');
var  hotelModel = require('../../models/hotels');
var basemodels = require('../../models/basemodels');

exports.updateCity = function(req,res,callback){   
    var citycallback = async function(cities){
        var provider = await cityModel.getProvider();
        // city = cities[0];
        // if(typeof countries[city['Country'][0]['Name'][0]] == 'undefined')
        //     var countryid = await cityModel.addcountry(city,provider);
        // else var countryid = countries[city['Country'][0]['Name'][0]] ;
        // if(countryid != 'undefined'){
        //     var cityid = await cityModel.addcity(city,countryid);
        //     if(cityid != 'undefined')
        //     cityModel.addRegion(city,cityid);
        // }
            
        for (var city of cities) {
            if(typeof city['Country'] != 'undefined'){
                var countryid =  await cityModel.getCountriesByName(city['Country'][0]['Name'][0]);
                if(! countryid)
                    var countryid = await cityModel.addcountry(city,provider);

                if(countryid){
                    var cityid = await cityModel.addcity(city,countryid,provider);
                    if(cityid != 'undefined')
                        cityModel.addRegion(city,cityid,provider);
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
        for (var hotel of data) {
            await hotelModel.addHotelProtofilo(hotel,provderid);
        }
     }
    //  sFunction.hotelPortfolio(req,res,callback);
    getfiledataHotlupdate(req,res,callback);
}

getfiledataHotlupdate = async function(req,res, callback){
    const path ='hotelprotofolio.json';
    if (fs.existsSync(path)) {
        basemodels.readfile(path,callback)
    }else{
        var callback = function(err,data){
            fs.writeFileSync(path, JSON.stringify({err,data}));
         }
        sFunction.hotelPortfolio(req,res,callback);
    }
}

getfiledata = async function(req,res,callback){
    const path ='response.json';
    if (fs.existsSync(path)) {
       basemodels.readfile(path,callback)
    }else{
        var callback = function(err,data){
            fs.writeFileSync(path, JSON.stringify({err,data}));
         }
        sFunction.CityList(req,res,callback);
    }
}