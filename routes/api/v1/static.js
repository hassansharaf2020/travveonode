var express = require('express');
var router = express.Router();
var juniperStaticData = require('../../../controllers/juniper/juniperStaticDataCtr');
var giata = require('../../../controllers/giata/giataData');
var update = require('../../../controllers/juniper/juniperUpdate');

/* GET HotelPortfolio */
router.get('/hotelportfolio', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.hotelPortfolio(req,res,callback)
});

/* GET RoomList */
router.get('/roomlist', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.roomList(req,res,callback)
});

/* GET HotelContent */
router.get('/hotelcontent/:code', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.hotelContent(req,res,callback)
});

/* GET CityList */
router.get('/citylist', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.CityList(req,res,callback)
});

/* GET HotelCatalogueData */
router.get('/ZoneList', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.hotelCatalogueData(req,res,callback)
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

module.exports = router;