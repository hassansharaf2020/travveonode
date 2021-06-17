var express = require('express');
var router = express.Router();
var juniperStaticData = require('../../../controllers/juniper/juniperStaticDataCtr');
var db = require('../../../models/db')

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

/* GET hotelAvail */
router.post('/hotelavail', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.hotelAvail(req,res,callback)
});

/* GET HotelCheckAvail */
router.post('/hotelcheckavail', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.HotelCheckAvail(req,res,callback)
});

/* GET HotelBookingRules */
router.post('/hotelbookingrules', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.hotelBookingRules(req,res,callback)
});


/* GET HotelBooking */
router.post('/hotelbooking', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.hotelBooking(req,res,callback)
});

/* GET CancelBooking */
router.post('/cancelbooking', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperStaticData.cancelBooking(req,res,callback)
});

/* GET CancelBooking */
router.get('/test', function(req, res, next) {
    var callback = function(data){
        res.send(data);
    }
    db.execute("SELECT * FROM `city_data` WHERE `id`=1;SELECT * FROM `city_data` WHERE `id`=2",callback);
});

module.exports = router;