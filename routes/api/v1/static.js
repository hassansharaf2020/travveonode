var express = require('express');
var router = express.Router();
var juniperStaticData = require('../../../controllers/juniper/juniperStaticDataCtr');
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
router.get('/updatecitylist', async function(req, res, next) {
    await update.updateCity(req,res);
    res.send({data:["result:success"]})
});

/* GET UpdateCityList */
router.get('/updatehotelportfolio', async function(req, res, next) {
    await update.updateHotelPortfolio(req,res);
    res.send({data:["result:success"]})
});

module.exports = router;