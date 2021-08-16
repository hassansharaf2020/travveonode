var Juniper = require('./juniper/juniperSearchCtr');
exports.hotelAvail = function(req,res,resultCallback){
    function callback(err , data){
        resultCallback(err,data);
    }
    Juniper.hotelAvail(req,res,callback);
}

exports.HotelCheckAvail = function(req,res,resultCallback){
    function callback(err , data){
        resultCallback(err,data);
    }
    Juniper.HotelCheckAvail(req,res,callback);
}

exports.hotelBookingRules = function(req,res,resultCallback){
    function callback(err , data){
        // console.log(err['soap:Reason'][0],data);
        resultCallback(err,data);
    }
    Juniper.hotelBookingRules(req,res,callback);
}

exports.hotelBooking = function(req,res,resultCallback){
    function callback(err , data){
        // console.log(err['soap:Reason'][0],data);
        resultCallback(err,data);
    }
    Juniper.hotelBooking(req,res,callback);
}

exports.cancelBooking = function(req,res,resultCallback){
    function callback(err , data){
        resultCallback(err,data);
    }
    Juniper.cancelBooking(req,res,callback);
}