const { juniper_user , juniper_pass , juniper_lang } = require('../../config');
var basemodels = require('../../models/basemodels');

//get HotelPortfolio
exports.hotelPortfolio = function(req,res,token,callback){
  function HotelPortfolioCallback (err , data){
    var error = basemodels.handelError(err,data,['HotelPortfolioResponse','HotelPortfolioRS','HotelPortfolio']);
    if(error.length != 0) return callback(error,[]);

    var hotels = data['soap:Envelope']['soap:Body'][0]['HotelPortfolioResponse'][0]['HotelPortfolioRS'][0]['HotelPortfolio'][0];
    return callback(err,hotels);
  }
  var HotelPortfolioBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><HotelPortfolio><HotelPortfolioRQ Version="1.1" Language="'+juniper_lang+'" Token="'+token+'" RecordsPerPage="500"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/></HotelPortfolioRQ></HotelPortfolio></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(HotelPortfolioBody , HotelPortfolioCallback ,'HotelPortfolio')
}

//get RoomList
exports.roomList = function(req,res,callback){
  function RoomListCallback (err , data){
    var error = basemodels.handelError(err,data,['RoomListResponse','RoomListRS','RoomList']);
    if(error.length != 0) return callback(error,[]); 
    
    var hotels = data['soap:Envelope']['soap:Body'][0]['RoomListResponse'][0]['RoomListRS'][0]['RoomList'][0]['Room'];
    return callback(err,hotels) ;
  }
  var RoomListBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><RoomList><!--Optional:--><RoomListRQ Version="1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/></RoomListRQ></RoomList></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(RoomListBody , RoomListCallback ,'RoomList')
}

//get HotelContent
exports.hotelContent = function(req,res,allcodes,callback){
  function HotelContentCallback (err , data){
    var error = basemodels.handelError(err,data,['HotelContentResponse','ContentRS','Contents']);
    if(error.length != 0) return callback(error,[]);
    
    var hotels =  data['soap:Envelope']['soap:Body'][0]['HotelContentResponse'][0]['ContentRS'][0]['Contents'][0]['HotelContent'];
    return callback(err,hotels) ;
  }
  console.log(typeof allcodes);
  var codes ='';
  if(typeof allcodes == 'object'){
    codes = '<Hotel Code="'+allcodes['code']+'"/>';
  }else{
    allcodes.forEach(code => {
      codes += '<Hotel Code="'+code['code']+'"/>';
    });
  }
  var HotelContentBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><HotelContent><HotelContentRQ Version="1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><HotelContentList>'+codes+'</HotelContentList></HotelContentRQ></HotelContent></soapenv:Body></soapenv:Envelope>'
  console.log(HotelContentBody);
  basemodels.juniperRequest(HotelContentBody , HotelContentCallback ,'HotelContent')
}


//get CityList
exports.CityList = function(req,res,callback){
  function CityListCallback (err , data){
    var error = basemodels.handelError(err,data,['CityListResponse','CityListRS','CityList']);
    if(error.length != 0) return callback(error,[]);
    var hotels =  data['soap:Envelope']['soap:Body'][0]['CityListResponse'][0]['CityListRS'][0]['CityList'][0]['City'];
    return callback(err,hotels) ;
  }
  var CityListBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><CityList><CityListRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/></CityListRQ></CityList></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(CityListBody , CityListCallback ,'CityList')
}

//get HotelCatalogueData

exports.hotelCatalogueData = function(req,res,callback){
  function HotelCatalogueDataCallback (err , data){
    var error = basemodels.handelError(err,data,['HotelCatalogueDataResponse','CatalogueDataRS']);
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
    var error = basemodels.handelError(err,data,['ZoneListResponse','ZoneListRS']);
    if(error.length != 0) return callback(error,[]); 
    var hotels = data['soap:Envelope']['soap:Body'][0]['ZoneListResponse'][0]['ZoneListRS'][0]['ZoneList'][0]['Zone'];
    return callback(err,hotels) ;
  }
  var ZoneListBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><ZoneList><ZoneListRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><ZoneListRequest ProductType="HOT" MaxLevel="50" /></ZoneListRQ></ZoneList></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(ZoneListBody , ZoneListCallback ,'ZoneList')
}

//get hotellist
exports.hotelList = function(req,res,callback){
  function HotelListCallback (err , data){
    var error = basemodels.handelError(err,data,['HotelListResponse','HotelListRS']);
    if(error.length != 0) return callback(error,[]); 
    var hotels = data['soap:Envelope']['soap:Body'][0]['HotelListResponse'][0]['HotelListRS'][0]['HotelList'];
    return callback(err,hotels) ;
  }
  var HotelListBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body> <HotelList><HotelListRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><HotelListRequest ZoneCode="2" ShowBasicInfo="true"/></HotelListRQ> </HotelList></soapenv:Body></soapenv:Envelope>'
  basemodels.juniperRequest(HotelListBody , HotelListCallback ,'HotelList')
}