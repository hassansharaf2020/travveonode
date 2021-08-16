var express = require('express');
var router = express.Router();
var juniperStaticData = require('../../../controllers/juniper/juniperStaticDataCtr');
var giata = require('../../../controllers/giata/giataData');
var update = require('../../../controllers/juniper/juniperUpdate');

/* GET HotelPortfolio */
router.get('/hotelportfolio', function(req, res, next) {
    var result=[];
    var callback = function(err,data){
        result = result.concat(data['Hotel']);
        console.log(result.length);
        if(typeof data['$'] != 'undefined'){
            var token = data['$']['NextToken'];
            console.log(token);
            if(token){
                juniperStaticData.hotelPortfolio(req,res,token,callback)
            }
        }
    }
    juniperStaticData.hotelPortfolio(req,res,'',callback)
});

/* GET RoomList */
router.get('/roomlist', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.roomList(req,res,callback)
});

/* GET HotelContent */
router.get('/hotelcontent/:code', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.hotelContent(req,res,{'code':req.params.code},callback)
});

/* GET CityList */
router.get('/citylist', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.CityList(req,res,callback)
});

/* GET HotelCatalogueData */
router.get('/hotelcataloguedata', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.hotelCatalogueData(req,res,callback)
});

/* GET HotelList */
router.get('/hotellist', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.hotelList(req,res,callback)
});

/* GET HotelContent */
router.get('/hotelcontent', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    update.updateHotelContent(req,res,callback)
});

/* GET ZoneList */
router.get('/zonelist', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    update.updateZoneList(req,res,callback)
});

/* GET UpdateCityList */
router.get('/updatecitylist', function(req, res, next) {
    var callback = function(data){ res.send({data}); }
    update.updateCity(req,res,callback);
});

/* GET UpdateCityList */
router.get('/updatehotelportfolio', async function(req, res, next) {
    update.updateHotelPortfolio(req,res);
    // res.send({data:["result:success"]})
});

/* GET startinfoservice */
router.get('/startinfoservice', async function(req, res, next) {
    var callback = function(data){ res.send({data}); }
    giata.startInfoService(req,res,callback);
});

/* GET startMultipeCodesService */
router.get('/startMultipeCodesService', async function(req, res, next) {
    var callback = function(data){ res.send({data}); }
    giata.startMultipeCodesService(req,res,callback);
});


/*
*
*call only one time
*/
/* GET factSheetDefinitions */
router.get('/factSheetDefinitions', async function(req, res, next) {
    var callback = function(data){ res.send({data}); }
    giata.factSheetDefinitions(req,res,callback);
});

/* GET getallaiports */
router.get('/getallaiports', async function(req, res, next) {
    var callback = function(data){ res.send({data}); }
    giata.getAllAirports(req,res,callback);
});

/* GET destinations */
router.get('/getalldestinations', async function(req, res, next) {
    var callback = function(data){ res.send({data}); }
    giata.getAllDestinations(req,res,callback);
});

module.exports = router;