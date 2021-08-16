var express = require('express');
var router = express.Router();
var juniperSearch = require('../../../controllers/search');

/* GET hotelAvail */
router.post('/hotelavail', function(req, res, next) {
    var callback = function(err,data){res.send({err,data}); }
    juniperSearch.hotelAvail(req,res,callback)
});

/* GET HotelCheckAvail */
router.post('/hotelcheckavail', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperSearch.HotelCheckAvail(req,res,callback)
});

/* GET HotelBookingRules */
router.post('/hotelbookingrules', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperSearch.hotelBookingRules(req,res,callback)
});


/* GET HotelBooking */
router.post('/hotelbooking', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperSearch.hotelBooking(req,res,callback)
});

/* GET CancelBooking */
router.post('/cancelbooking', function(req, res, next) {
    var callback = function(err,data){ res.send({err,data}); }
    juniperSearch.cancelBooking(req,res,callback)
});

module.exports = router;