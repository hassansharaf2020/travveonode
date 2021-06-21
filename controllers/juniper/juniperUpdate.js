var sFunction  =  require('./juniperStaticDataCtr');
const fs = require('fs');
var  cityModel = require('../../models/cities');
var  hotelModel = require('../../models/hotels');

exports.updateCity = async function(req,res){   
    citycallback =  async function(cities){
        //get all countries
        let countries = await cityModel.getCountries();
        //loop for all cityes
        await cities.forEach(async city => {
            //get country id by check if country exist or not
            if(countries[city['Country'][0]['Name'][0]] == 'undefined')
                countryid = await cityModel.addcountry();
            else countryid = countries[city['Country'][0]['Name'][0]] ;

            if(countryid){
                cityid = await cityModel.addcity(city,countryid);

            if(cityid)
                await cityModel.addRegion(city,cityid);
            }
        });
    }
    getfiledata(req,res,citycallback);   
}

exports.updateHotelPortfolio = async function(req,res){
    var callback = async function(err,data){
        provderid = await hotelModel.provider();
        await data.forEach(async hotel => {
            await hotelModel.addHotelProtofilo(hotel,provderid);
        })
     }
     sFunction.hotelPortfolio(req,res,callback);
    //  getfiledataHotlupdate(req,res,callback);
}

getfiledataHotlupdate = async function(req,res, callback){
    const path ='hotelprotogilo.json';
    if (fs.existsSync(path)) {
        fs.readFile(path, 'utf8', async function(err, data) {
            if (err) throw err;
            hotels = JSON.parse(data);
            result = [];cash = [];i=0;
            hotels['data'].forEach(hotel=>{
                if(i < 100) result[i] = hotel;
                else cash[i-100] = hotel;
                i++;
            });
            hotels['data'] = cash;

            if(hotels['data'].length == 0) fs.unlinkSync(path);
            else{
                fs.writeFile(path, JSON.stringify(hotels), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }
            callback(result)
          });
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
        fs.readFile(path, 'utf8', async function(err, data) {
            if (err) throw err;
            cities = JSON.parse(data);
            result = [];cash = [];i=0;
            cities['data'][0]['City'].forEach(city=>{
                if(i < 100) result[i] = city;
                else cash[i-100] = city;
                i++;
            });
            cities['data'][0]['City'] = cash;

            if(cities['data'][0]['City'].length == 0) fs.unlinkSync(path);
            else{
                fs.writeFile(path, JSON.stringify(cities), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }
            callback(result)
          });
    }else{
        var callback = function(err,data){
            fs.writeFileSync(path, JSON.stringify({err,data}));
         }
        sFunction.CityList(req,res,callback);
    }
}