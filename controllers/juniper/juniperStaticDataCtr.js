var constants = require('../../config');
const { juniper_user , juniper_pass , juniper_lang } = require('../../config');
var basemodels = require('../../models/basemodels');

//get HotelPortfolio
exports.hotelPortfolio = function(req,res,callback){
  function HotelPortfolioCallback (err , data){
    var error = basemodels.handelError(err,data,"['HotelPortfolioResponse'][0]['HotelPortfolioRS'][0]['HotelPortfolio']");
    if(error.length != 0) return callback(error,[]);

    var hotels = data['soap:Envelope']['soap:Body'][0]['HotelPortfolioResponse'][0]['HotelPortfolioRS'][0]['HotelPortfolio'][0]['Hotel'];
    return callback(err,hotels) ;
  }
  var HotelPortfolioBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><HotelPortfolio><HotelPortfolioRQ Version="1.1" Language="'+juniper_lang+'" Page="1" RecordsPerPage="500"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/></HotelPortfolioRQ></HotelPortfolio></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(HotelPortfolioBody , HotelPortfolioCallback ,'HotelPortfolio')
}

//get RoomList
exports.roomList = function(req,res,callback){
  function RoomListCallback (err , data){
    var error = basemodels.handelError(err,data,"['RoomListResponse'][0]['RoomListRS'][0]['RoomList']");
    if(error.length != 0) return callback(error,[]); 
    
    var hotels = data['soap:Envelope']['soap:Body'][0]['RoomListResponse'][0]['RoomListRS'][0]['RoomList'][0]['Room'];
    return callback(err,hotels) ;
  }
  var RoomListBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><RoomList><!--Optional:--><RoomListRQ Version="1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/></RoomListRQ></RoomList></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(RoomListBody , RoomListCallback ,'RoomList')
}

//get HotelContent
exports.hotelContent = function(req,res,callback){
  function HotelContentCallback (err , data){
    var error = basemodels.handelError(err,data,"['HotelContentResponse'][0]['ContentRS'][0]['Contents']");
    if(error.length != 0) return callback(error,[]);
    
    var hotels =  data['soap:Envelope']['soap:Body'][0]['HotelContentResponse'][0]['ContentRS'][0]['Contents'][0]['HotelContent'];
    return callback(err,hotels) ;
  }
  var HotelContentBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><HotelContent><HotelContentRQ Version="1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><HotelContentList><Hotel Code="'+req.params.code+'"/></HotelContentList></HotelContentRQ></HotelContent></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(HotelContentBody , HotelContentCallback ,'HotelContent')
}


//get CityList
exports.CityList = function(req,res,callback){
  function CityListCallback (err , data){
    var error = basemodels.handelError(err,data,"['CityListResponse'][0]['CityListRS'][0]['CityList']");
    if(error.length != 0) return callback(error,[]);
    var hotels =  data['soap:Envelope']['soap:Body'][0]['CityListResponse'][0]['CityListRS'][0]['CityList'];
    return callback(err,hotels) ;
  }
  var CityListBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><CityList><CityListRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/></CityListRQ></CityList></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(CityListBody , CityListCallback ,'CityList')
}

//get HotelCatalogueData

exports.hotelCatalogueData = function(req,res,callback){
  function HotelCatalogueDataCallback (err , data){
    var error = basemodels.handelError(err,data,"['HotelCatalogueDataResponse'][0]['CatalogueDataRS']");
    if(error.length != 0) return callback(error,[]); 
    var hotels = data['soap:Envelope']['soap:Body'][0]['HotelCatalogueDataResponse'][0]['CatalogueDataRS'][0]['HotelStaticData'];
    return callback(err,hotels) ;
  }
  var HotelCatalogueDataBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><HotelCatalogueData><HotelCatalogueDataRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/></HotelCatalogueDataRQ></HotelCatalogueData></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(HotelCatalogueDataBody , HotelCatalogueDataCallback ,'HotelCatalogueData')
}


//get zoneList

exports.zoneList = function(req,res,callback){
  function ZoneListCallback (err , data){
    var error = basemodels.handelError(err,data,"['ZoneListResponse'][0]['ZoneListRS']");
    if(error.length != 0) return callback(error,[]); 
    var hotels = data['soap:Envelope']['soap:Body'][0]['ZoneListResponse'][0]['ZoneListRS'][0]['ZoneList'];
    return callback(err,hotels) ;
  }
  var ZoneListBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><ZoneList><ZoneListRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><ZoneListRequest ProductType="HOT"/></ZoneListRQ></ZoneList></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(ZoneListBody , ZoneListCallback ,'ZoneList')
}

//get HotelAvail
exports.hotelAvail = function(req,res,callback){
  function HotelAvailCallback (err , data){
    var error = basemodels.handelError(err,data,"['HotelAvailResponse'][0]['AvailabilityRS']");
    if(error.length != 0) return callback(error,[]); 
    var hotels = data['soap:Envelope']['soap:Body'][0]['HotelAvailResponse'][0]['AvailabilityRS'][0]['Results'][0]['HotelResult'];
    return callback(err,hotels) ;
  }

  var checkinDate = req.body.checkinDate;
  var checkoutDate = req.body.checkoutDate;
  var adults = req.body.adults ?? []; var pax = '';
  var children = req.body.children ?? []; var relpax = '';
  var country = req.body.country ?? "EG";
  var codes = req.body.codes ?? []; var hotel = '';

  var i=1;
  adults.forEach(element => {
    pax += '<Pax IdPax="'+i+'"><Age>'+element+'</Age></Pax>';
    relpax += '<RelPax IdPax="'+i+'"/>'; i++;
  });

  children.forEach(element => {
    pax += '<Pax IdPax="'+i+'"><Age>'+element+'</Age></Pax>';
    relpax += '<RelPax IdPax="'+i+'"/>'; i++;
  });
  
  if(codes.length > 0){
    hotel +='<HotelCodes>';
    codes.forEach(element => {
      hotel += '<HotelCode>'+element+'</HotelCode>'; 
    });
    hotel +='</HotelCodes>';
  }

  var HotelAvailBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><HotelAvail xmlns="http://www.juniper.es/webservice/2007/"><HotelAvailRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><Paxes>'+pax+'</Paxes><HotelRequest><SearchSegmentsHotels><SearchSegmentHotels Start="'+checkinDate+'" End="'+checkoutDate+'"/><CountryOfResidence>'+country+'</CountryOfResidence>'+hotel+'</SearchSegmentsHotels><RelPaxesDist><RelPaxDist><RelPaxes>'+relpax+'</RelPaxes></RelPaxDist></RelPaxesDist></HotelRequest><AdvancedOptions><ShowHotelInfo>false</ShowHotelInfo><ShowOnlyBestPriceCombination>true</ShowOnlyBestPriceCombination><TimeOut>8000</TimeOut></AdvancedOptions></HotelAvailRQ></HotelAvail></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(HotelAvailBody , HotelAvailCallback ,'HotelAvail','availtransactions.asmx')
}

//get HotelCheckAvail
exports.HotelCheckAvail = function(req,res,callback){
  function HotelCheckAvailCallback (err , data){
    var error = basemodels.handelError(err,data,"['HotelCheckAvailResponse'][0]['CheckAvailRS']");
    if(error.length != 0) return callback(error,[]); 
    var hotels = data['soap:Envelope']['soap:Body'][0]['HotelCheckAvailResponse'][0]['CheckAvailRS'][0]['Results'][0]['HotelResult'];
    return callback(err,hotels) ;
  }

  var checkinDate = req.body.checkinDate;
  var checkoutDate = req.body.checkoutDate;
  var rateplancode = req.body.rateplancode;
  var code = req.body.code;

  var HotelCheckAvailBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><HotelCheckAvail><HotelCheckAvailRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><HotelCheckAvailRequest><HotelOption RatePlanCode="'+rateplancode+'"/><SearchSegmentsHotels><SearchSegmentHotels Start="'+checkinDate+'" End="'+checkoutDate+'"/><HotelCodes><HotelCode>'+code+'</HotelCode></HotelCodes></SearchSegmentsHotels></HotelCheckAvailRequest></HotelCheckAvailRQ></HotelCheckAvail></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(HotelCheckAvailBody , HotelCheckAvailCallback ,'HotelCheckAvail','checktransactions.asmx')
}

//get HotelBookingRules
exports.hotelBookingRules = function(req,res,callback){
  function HotelBookingRulesCallback (err , data){
    var error = basemodels.handelError(err,data,"['HotelBookingRulesResponse'][0]['BookingRulesRS']");
    if(error.length != 0) return callback(error,[]); 
    var hotels = data['soap:Envelope']['soap:Body'][0]['HotelBookingRulesResponse'][0]['BookingRulesRS'][0]['Results'][0]['HotelResult'];
    return callback(err,hotels) ;
  }

  var checkinDate = req.body.checkinDate;
  var checkoutDate = req.body.checkoutDate;
  var rateplancode = req.body.rateplancode;
  var code = req.body.code;

  var HotelBookingRulesBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns="http://www.juniper.es/webservice/2007/"><soap:Header/><soap:Body><HotelBookingRules><HotelBookingRulesRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><HotelBookingRulesRequest><HotelOption RatePlanCode="'+rateplancode+'"/><SearchSegmentsHotels><SearchSegmentHotels Start="'+checkinDate+'" End="'+checkoutDate+'"/><HotelCodes><HotelCode>'+code+'</HotelCode></HotelCodes></SearchSegmentsHotels></HotelBookingRulesRequest></HotelBookingRulesRQ></HotelBookingRules></soap:Body></soap:Envelope>'
  basemodels.juniperRequest(HotelBookingRulesBody , HotelBookingRulesCallback ,'HotelBookingRules','checktransactions.asmx')
}

//HotelBooking
exports.hotelBooking = function(req,res,callback){
  function HotelBookingCallback (err , data){
    var error = basemodels.handelError(err,data,"['HotelBookingResponse'][0]['BookingRS']");
    if(error.length != 0) return callback(error,[]); 
    var hotels = data['soap:Envelope']['soap:Body'][0]['HotelBookingResponse'][0]['BookingRS'][0]['Reservations'][0];
    return callback(err,hotels) ;
  }

  var checkinDate = req.body.checkinDate;
  var checkoutDate = req.body.checkoutDate;
  var guide = req.body.guide;
  var hotelcode = req.body.hotelcode;
  var bookcode = req.body.bookcode;
  var booking_comment = req.body.booking_comment;
  var booking_line_comment = req.body.booking_line_comment;
  var minprice = req.body.minprice;
  var maxprice = req.body.maxprice;
  var currency = req.body.currency;
  var adults = req.body.adults ?? []; var pax = '';
  var children = req.body.children ?? []; var relpax = '';

  var i=1;
  adults.forEach(element => {
    pax += '<Pax IdPax="2"><Name>'+element["name"]+'</Name><Surname>'+element["surname"]+'</Surname><Age>'+element["age"]+'</Age></Pax>';
    relpax += '<RelPax IdPax="'+i+'"/>'; i++;
  });

  children.forEach(element => {
    pax += '<Pax IdPax="2"><Name>'+element["name"]+'</Name><Surname>'+element["surname"]+'</Surname><Age>'+element["age"]+'</Age></Pax>';
    relpax += '<RelPax IdPax="'+i+'"/>'; i++;
  });

  var HotelBookingBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.juniper.es/webservice/2007/">soapenv:Header/>soapenv:Body>HotelBooking xmlns="http://www.juniper.es/webservice/2007/">HotelBookingRQ Version="1.1" Language="{{Language}}">Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/>Paxes>Pax IdPax="1">'+pax+'</Paxes>Holder>RelPax IdPax="1"/>/Holder>ExternalBookingReference>'+guide+'</ExternalBookingReference>Comments>Comment Type="RES">'+booking_comment+'</Comment>/Comments>Elements>HotelElement>BookingCode>'+bookcode+'</BookingCode>RelPaxesDist>RelPaxDist>RelPaxes>'+relpax+'</RelPaxes>/RelPaxDist>/RelPaxesDist>Comments>Comment Type="ELE">'+booking_line_comment+'</Comment>/Comments>HotelBookingInfo Start="'+checkinDate+'" End="'+checkoutDate+'">Price>PriceRange Minimum="'+minprice+'" Maximum="'+maxprice+'" Currency="'+currency+'"/>/Price>HotelCode>'+hotelcode+'</HotelCode>/HotelBookingInfo>/HotelElement>/Elements>AdvancedOptions>ShowBreakdownPrice>true</ShowBreakdownPrice>/AdvancedOptions>/HotelBookingRQ>/HotelBooking>/soapenv:Body>/soapenv:Envelope>'
  basemodels.juniperRequest(HotelBookingBody , HotelBookingCallback ,'HotelBooking','BookTransactions.asmx')
}

//get CancelBooking
exports.cancelBooking = function(req,res,callback){
  function CancelBookingCallback (err , data){
    var error = basemodels.handelError(err,data,"['CancelBookingResponse'][0]['BookingRS']");
    if(error.length != 0) return callback(error,[]); 
    var hotels = data['soap:Envelope']['soap:Body'][0]['CancelBookingResponse'][0]['BookingRS'][0]['Warnings'][0];
    return callback(err,hotels) ;
  }

  var  reservationlocator = req.body.reservationlocator;

  var CancelBookingBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><CancelBooking><CancelRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><CancelRequest ReservationLocator="'+reservationlocator+'"/></CancelRQ></CancelBooking></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(CancelBookingBody , CancelBookingCallback ,'CancelBooking','checktransactions.asmx')
}