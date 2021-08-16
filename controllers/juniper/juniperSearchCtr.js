const { juniper_user , juniper_pass , juniper_lang } = require('../../config');
var basemodels = require('../../models/basemodels');
var Property = require('../../models/property');
var CityModel = require('../../models/cities');
const { type } = require('os');

/*
  *
  *
  * get HotelAvail
  *
  *
  */
exports.hotelAvail = async function(req,res,callback){
    //request data
    var checkinDate = req.body.checkinDate;
    var checkoutDate = req.body.checkoutDate;
    var adults = req.body.adults ?? 0; var pax = '';
    var children = req.body.children ?? []; var relpax = '';
    var cityid = req.body.cityid ?? 0;
    var hotelids = req.body.hotelids ?? [];
    var page = req.body.page ?? 1;
    var perpage = req.body.perpage ?? 20;
    var providerid = await CityModel.getProvider();
    var flagcoutnt = 0;var callbackcount=0;
    var allresult= {};
    //handel callback functons
    function HotelAvailCallback (err , data){
      var error = basemodels.handelError(err,data,['HotelAvailResponse','AvailabilityRS','Results']);
      if(error.length != 0) return callback(error,[]); 
      var hotels = data['soap:Envelope']['soap:Body'][0]['HotelAvailResponse'][0]['AvailabilityRS'][0]['Results'][0]['HotelResult'];
      var result = handelAvilResponse(hotels,providerid,adults,children);
      allresult = Object.assign(allresult,result);
      callbackcount ++;
      if(callbackcount == flagcoutnt){
        // size = Object.size(allresult);
        return callback(err,{'hotels':allresult}) ;
      }
    }
    
    var countrycode='EG';
    var destinationZone = '';
    // var cityCode = await CityModel.getcityCodeByid(cityid,1);
    // var countrycode = await CityModel.getcountryCodebycityid(cityid);
    // destinationZone =  'JPDCode="'+cityCode+'"';

    var allpaxes = getpaxes(adults,children);
    pax = allpaxes['pax'];
    relpax = allpaxes['relPaxDist'];

    var country = '<CountryOfResidence>'+countrycode+'</CountryOfResidence>';
    var hotelCodes = '';
    if(hotelids.length > 0) var codes = await Property.getHotelCodesByHotelIds(hotelids,providerid,$page=1);
    else var codes = await Property.getHotelCodesByCityId(cityid,providerid,$page=1);
    

    var counter=0; var index=0;var allcodes='';
    codes.forEach(hotel => {
      allcodes += '<HotelCode>'+hotel['hotelcode']+'</HotelCode>';
      index ++ ;counter++;
      if(index == 250 || counter == codes.length){
        flagcoutnt ++;
        hotelCodes ='<HotelCodes>'+allcodes+'</HotelCodes>';
        allcodes= '';index=0;
        var HotelAvailBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><HotelAvail xmlns="http://www.juniper.es/webservice/2007/"><HotelAvailRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/>';
        HotelAvailBody += '<Paxes>'+pax+'</Paxes>';
        HotelAvailBody += '<HotelRequest><SearchSegmentsHotels><SearchSegmentHotels Start="'+checkinDate+'" End="'+checkoutDate+'" '+destinationZone+' />'+country+hotelCodes+'</SearchSegmentsHotels><RelPaxesDist>'+relpax+'</RelPaxesDist></HotelRequest>';
        HotelAvailBody += '<AdvancedOptions><ShowOnlyAvailable>true</ShowOnlyAvailable><ShowOnlyBestPriceCombination>true</ShowOnlyBestPriceCombination><TimeOut>8000</TimeOut><ShowAllChildrenCombinations>true</ShowAllChildrenCombinations></AdvancedOptions>';
        HotelAvailBody += '</HotelAvailRQ></HotelAvail></soapenv:Body></soapenv:Envelope>'
        console.log(HotelAvailBody);
        basemodels.juniperRequest(HotelAvailBody , HotelAvailCallback ,'HotelAvail','availtransactions.asmx')
      }
    });
    
    
  // var xml2js = require('xml2js');
    // var fs = require('fs');
    // fs.readFile('avial.txt', 'utf8', async function(err, data) {
    //   xml2js.parseString(data, (err, data) => {
    //     if(err)  HotelAvailCallback(err , [])
    //     else HotelAvailCallback([] , data)
    //   });
    // });
  
  }
  
  /*
  *
  *
  * Hotel CheckAvail
  *
  *
  */
  exports.HotelCheckAvail = function(req,res,callback){
    function HotelCheckAvailCallback (err , data){
      var error = basemodels.handelError(err,data,['HotelCheckAvailResponse','CheckAvailRS','Results']);
      if(error.length != 0) return callback(error,[]); 
      var hotels = data['soap:Envelope']['soap:Body'][0]['HotelCheckAvailResponse'][0]['CheckAvailRS'][0]['Results'][0]['HotelResult'];
      return callback(err,hotels) ;
    }
  
    var checkinDate = req.body.checkinDate;
    var checkoutDate = req.body.checkoutDate;
    var rateplancode = req.body.token;
    var code = req.body.code;
  
    var HotelCheckAvailBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><HotelCheckAvail><HotelCheckAvailRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><HotelCheckAvailRequest><HotelOption RatePlanCode="'+rateplancode+'"/><SearchSegmentsHotels><SearchSegmentHotels Start="'+checkinDate+'" End="'+checkoutDate+'"/><HotelCodes><HotelCode>'+code+'</HotelCode></HotelCodes></SearchSegmentsHotels></HotelCheckAvailRequest></HotelCheckAvailRQ></HotelCheckAvail></soapenv:Body></soapenv:Envelope>'
    console.log(HotelCheckAvailBody);
    basemodels.juniperRequest(HotelCheckAvailBody , HotelCheckAvailCallback ,'HotelCheckAvail','checktransactions.asmx')
  }
  
  /*
  *
  *
  * Hotel Booking Rules
  *
  *
  */

  exports.hotelBookingRules =  function(req,res,callback){
    var checkinDate = req.body.checkinDate;
    var checkoutDate = req.body.checkoutDate;
    var rateplancode = req.body.token;
    var code = req.body.code;
    var adults = req.body.adults ?? [];
    var children = req.body.children ?? [];
    async function HotelBookingRulesCallback (err , data){
      var error = basemodels.handelError(err,data,['HotelBookingRulesResponse','BookingRulesRS','Results']);
      if(error.length != 0) return callback(error,[]); 
      var providerid = await CityModel.getProvider();
      var hotels = data['soap:Envelope']['soap:Body'][0]['HotelBookingRulesResponse'][0]['BookingRulesRS'][0]['Results'][0]['HotelResult'];
      var result = handelRulesResponse(hotels,providerid,adults,children);
      return callback(err,result) ;
    }
  
    var HotelBookingRulesBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns="http://www.juniper.es/webservice/2007/"><soap:Header/><soap:Body><HotelBookingRules><HotelBookingRulesRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><HotelBookingRulesRequest><HotelOption RatePlanCode="'+rateplancode+'"/><SearchSegmentsHotels><SearchSegmentHotels Start="'+checkinDate+'" End="'+checkoutDate+'"/><HotelCodes><HotelCode>'+code+'</HotelCode></HotelCodes></SearchSegmentsHotels></HotelBookingRulesRequest></HotelBookingRulesRQ></HotelBookingRules></soap:Body></soap:Envelope>'
    console.log(HotelBookingRulesBody);
    basemodels.juniperRequest(HotelBookingRulesBody , HotelBookingRulesCallback ,'HotelBookingRules','checktransactions.asmx')
  }
  /*
  *
  *
  * Hotel Booking
  *
  *
  */
  exports.hotelBooking = function(req,res,callback){
    var checkinDate = req.body.checkinDate;
    var checkoutDate = req.body.checkoutDate;
    var guide = req.body.guide;
    var hotelcode = req.body.hotelcode;
    var bookcode = req.body.token;
    var booking_comment = req.body.booking_comment;
    var booking_line_comment = req.body.booking_line_comment;
    var minprice = req.body.minprice;
    var maxprice = req.body.maxprice;
    var currency = req.body.currency;
    var providerId = req.body.providerId;

    function HotelBookingCallback (err , data){
      var error = basemodels.handelError(err,data,['HotelBookingResponse','BookingRS']);
      if(error.length != 0) return callback(error,[]); 
      var bookingdata = data['soap:Envelope']['soap:Body'][0]['HotelBookingResponse'][0]['BookingRS'][0]['Reservations'][0];
      var result = handelBookingResponse(bookingdata,providerId);
      return callback(err,[result]) ;
    }

    var allpaxes = getpaxesForBooking(req);
    var pax = allpaxes['pax'];
    var relpax = allpaxes['relPaxDist'];
    var holder = allpaxes['holder'];

    var HotelBookingBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><HotelBooking xmlns="http://www.juniper.es/webservice/2007/"><HotelBookingRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/>';
    HotelBookingBody += '<Paxes>'+pax+'</Paxes>';
    HotelBookingBody += '<Holder> '+holder+' </Holder>';
    // HotelBookingBody += '<ExternalBookingReference>'+guide+'</ExternalBookingReference>';
    // HotelBookingBody += '<Comments><Comment Type="RES">'+booking_comment+'</Comment></Comments>';
    HotelBookingBody += '<Elements><HotelElement><BookingCode>'+bookcode+'</BookingCode><RelPaxesDist>'+relpax+'</RelPaxesDist>';
    // HotelBookingBody += '<Comments><Comment Type="ELE">'+booking_line_comment+'</Comment></Comments>';
    HotelBookingBody += '<HotelBookingInfo Start="'+checkinDate+'" End="'+checkoutDate+'"><Price><PriceRange Minimum="'+minprice+'" Maximum="'+maxprice+'" Currency="'+currency+'"/></Price><HotelCode>'+hotelcode+'</HotelCode></HotelBookingInfo>';
    HotelBookingBody += '</HotelElement></Elements></HotelBookingRQ></HotelBooking></soapenv:Body></soapenv:Envelope>';
    console.log(HotelBookingBody);
    basemodels.juniperRequest(HotelBookingBody , HotelBookingCallback ,'HotelBooking','BookTransactions.asmx')
  }
  /*
  *
  *
  * get CancelBooking
  *
  *
  */
  exports.cancelBooking = function(req,res,callback){
    function CancelBookingCallback (err , data){
      var error = basemodels.handelError(err,data,['CancelBookingResponse','BookingRS']);
      if(error.length != 0) return callback(error,[]); 
      var hotels = data['soap:Envelope']['soap:Body'][0]['CancelBookingResponse'][0]['BookingRS'][0]['Warnings'][0];
      return callback(err,hotels) ;
    }
  
    var  reservationlocator = req.body.reservationlocator;
  
    var CancelBookingBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns="http://www.juniper.es/webservice/2007/"><soapenv:Header/><soapenv:Body><CancelBooking><CancelRQ Version="1.1" Language="'+juniper_lang+'"><Login Password="'+juniper_pass+'" Email="'+juniper_user+'"/><CancelRequest ReservationLocator="'+reservationlocator+'"/></CancelRQ></CancelBooking></soapenv:Body></soapenv:Envelope>'
    basemodels.juniperRequest(CancelBookingBody , CancelBookingCallback ,'CancelBooking','BookTransactions.asmx')
  }

//////////////////////////////////////////////////
// handel Response
//////////////////////////////////////////////////

  /*
  *
  *
  * handel Avil Response
  *
  *
  */

  function handelAvilResponse(hotels,providerid,adults,children){
    var allhotels ={};
    hotels.forEach(hotel => {
        var code = hotel['$']['JPCode'];
        var hoteloptions = hotel['HotelOptions'][0]['HotelOption'];
        
        allhotels[code]={};
        allhotels[code]['code'] = code;
        allhotels[code]['providerId'] = providerid;
        allhotels[code]['rooms']={};

        hoteloptions.forEach(hoteloption=>{
          var options={};
          options['token'] = hoteloption['$']['RatePlanCode'];
          options['status'] = hoteloption['$']['Status'];
          options['NonRefundable'] = hoteloption['$']['NonRefundable'] == 'false' ? false : true;
          options['price'] = hoteloption['Prices'][0]['Price'][0]['TotalFixAmounts'][0]['$']['Gross'];
          options['currency'] = hoteloption['Prices'][0]['Price'][0]['$']['Currency'];
          var boards = [];
          hoteloption['Board'].forEach(board=>{
            if(typeof board == 'object') boards.push({'type':board['$']['Type'],'name':board['_']})
            else boards.push({'type':board,'name':board})
          });
          options['board'] = boards;

          var rooms = [];var roomtype='';
          if(typeof hoteloption['HotelRooms'] != 'undefined'){
            var roomcount=0;
            hoteloption['HotelRooms'][0]['HotelRoom'].forEach(room=>{
            
              if(typeof room['RoomOccupancy'] != 'undefined') var roomOcc = {'adults':parseInt(room['RoomOccupancy'][0]['$']['Adults']),'children':parseInt(room['RoomOccupancy'][0]['$']['Children'])};
              else var roomOcc = getadultsandchildcount(adults[roomcount],children[roomcount]);
              var type = typeof room['RoomCategory'][0]['$'] != 'undefined' ? room['RoomCategory'][0]['$']['Type'] : '';
              roomtype += type;
              rooms.push({
                'type': type,
                'name':room['Name']['0'],
                'RoomOccupancy': roomOcc
              });
              roomcount++;
            });
          }
          options['room'] = rooms;

          var offers = [];
          if(typeof hoteloption['AdditionalElements'] != 'undefined' && typeof hoteloption['AdditionalElements'][0]['HotelOffers'] != 'undefined'){
            hoteloption['AdditionalElements'][0]['HotelOffers'].forEach(offer=>{
              offers.push({
                'category':typeof offer['HotelOffer'][0]['$'] != 'undefined' ? offer['HotelOffer'][0]['$']['RoomCategory'] : '',
                'name':typeof offer['HotelOffer'][0]['Name'] !='undefined' ? offer['HotelOffer'][0]['Name'][0] : '',
                'description':typeof offer['HotelOffer'][0]['Description'] !='undefined' ? offer['HotelOffer'][0]['Description'][0] : '',
              });
            });
          }
          //merge si,ilat rooms
          if(typeof allhotels[code]['rooms'][roomtype] == 'undefined') allhotels[code]['rooms'][roomtype]=[];
          allhotels[code]['rooms'][roomtype].push(options);
        });
    });
    //convert option object to array
    for (const [key, value] of Object.entries(allhotels)) {
      allhotels[key]['rooms'] = Object.values(allhotels[key]['rooms']);
    }
    return allhotels;
  }

  /*
  *
  *
  * handel Rules Response
  *
  *
  */
  function handelRulesResponse(hotels,providerid,adults,children){
    var hotel = hotels[0]['HotelOptions'][0]['HotelOption'][0];
    var options={};
    options['status'] = hotel['$']['Status'];
    options['providerId'] = providerid;
    options['token'] = hotel['BookingCode'][0]['_'];
    options['token_expire'] = hotel['BookingCode'][0]['$']['ExpirationDate'];
    options['currency'] = hotel['CancellationPolicy'][0]['$']['CurrencyCode'];
    options['price'] = hotel['PriceInformation'][0]['Prices'][0]['Price'][0]['TotalFixAmounts'][0]['$']['Gross'];
    options['startDayCostCancel'] = hotel['CancellationPolicy'][0]['FirstDayCostCancellation'][0]['_'] + ' ' + hotel['CancellationPolicy'][0]['FirstDayCostCancellation'][0]['$']['Hour'];
    options['description'] = hotel['CancellationPolicy'][0]['Description'][0];
    var prices = hotel['HotelRequiredFields'][0]['HotelBooking'][0]['Elements'][0]['HotelElement'][0]['HotelBookingInfo'][0]['Price'][0]['PriceRange'][0]['$'];
    options['minprice'] = prices['Minimum'];
    options['maxprice'] = prices['Maximum'];

    options['policyRules'] = handelCancelPoliceRules(hotel['CancellationPolicy'][0]['PolicyRules'][0]['Rule']);
    
    var boards = [];
    hotel['PriceInformation'][0]['Board'].forEach(board=>{
      boards.push({'type':board['$']['Type'],'name':board['_']})
    });
    options['board'] = boards;

    var rooms = [];
    if(typeof hotel['PriceInformation'][0]['HotelRooms'] != 'undefined'){
      var roomcount=0;
      hotel['PriceInformation'][0]['HotelRooms'][0]['HotelRoom'].forEach(room=>{
        if(typeof room['RoomOccupancy'] != 'undefined') roomOcc = {'adults':parseInt(room['RoomOccupancy'][0]['$']['Adults']),'children':parseInt(room['RoomOccupancy'][0]['$']['Children'])};
        else var roomOcc = getadultsandchildcount(adults[roomcount],children[roomcount]);

        rooms.push({
          'type':room['RoomCategory'][0]['$']['Type'],
          'name':room['Name']['0'],
          'RoomOccupancy': roomOcc
        });
        roomcount++;
      });
    }
    options['room'] = rooms;
    
    return options;
  }

  function handelBookingResponse(booking,provider){
    var data ={};
    booking = booking['Reservation'][0];
    data['locator'] = booking['$']['Locator'];
    data['status'] = booking['$']['Status'];
    data['holderid'] = booking['Holder'][0]['RelPax'][0]['$']['IdPax'];
    var paxes = [];
    booking['Paxes'][0]['Pax'].forEach(pax=>{
      var object = {"IdPax":pax['$']['IdPax'],"name":pax['Name'][0],"surname":pax['Surname'][0],"age":pax['Age'][0]};
      if(typeof pax['Email'] != 'undefined'){
         object['email'] = pax['Email'][0]??'';
         object['Address'] = pax['Address'][0]??'';
         object['City'] = pax['City'][0]??'';
         object['Country'] = pax['Country'][0]??'';
         object['PostalCode'] = pax['PostalCode'][0]??'';
         object['Nationality'] = pax['Nationality'][0]??'';
      }
      paxes.push(object);
    });
    data['paxes'] = paxes;
    var hotelItem = booking['Items'][0]['HotelItem'][0];
    data['hotel'] = hotelItem['$'];
    data['price'] = hotelItem['Prices'][0]['Price'][0]['TotalFixAmounts'][0]['$']['Gross'];
    data['currency'] = hotelItem['Prices'][0]['Price'][0]['$']['Currency'];
    data['startDayCostCancel'] = hotelItem['CancellationPolicy'][0]['FirstDayCostCancellation'][0]['_'] + ' ' + hotelItem['CancellationPolicy'][0]['FirstDayCostCancellation'][0]['$']['Hour'];
    data['description'] = hotelItem['CancellationPolicy'][0]['Description'][0];
    data['policyRules'] = handelCancelPoliceRules(hotelItem['CancellationPolicy'][0]['PolicyRules'][0]['Rule']);
    
    var Comments=[];
    hotelItem['Comments'][0]['Comment'].forEach(comment=>{
      Comments.push({"comment":comment['_'],'type':comment['$']['Type']})
    });
    data['comments'] = Comments;

    var boards = [];
    hotelItem['Board'].forEach(board=>{
      if(typeof board == 'object') boards.push({'type':board['$']['Type'],'name':board['_']})
      else boards.push({'type':board,'name':board})
    });
    data['board'] = boards;

    var rooms = [];
    hotelItem['HotelRooms'][0]['HotelRoom'].forEach(room=>{
        var relpaxs = [];
        room['RelPaxes'][0]['RelPax'].forEach(pax=>{relpaxs.push(pax["$"]["IdPax"])});
        rooms.push({'JRCode': room["$"]["JRCode"],'name':room['Name']['0'],relpaxs});
      });
    data['rooms'] = rooms;
    return data;
  }

  /*
  *
  *
  * check Undefiend variable
  *
  *
  */
  function checkUndefiend(value,replace){
    return typeof value != 'undefined' ? value[0] : replace;
  }

  /*
  *
  *
  * Policy Rules Type
  *
  *
  */
  function PolicyRulesType(value){
    var type = value;
    if(value == 'V') type ='Before the check-in date';
    else if(value == 'R') type ='After the booking confirmation date';
    else if(value == 'S') type ='No Show';
    return type;
  }

  /*
  *
  *
  * adults and child count
  *
  *
  */
  function getadultsandchildcount(adults,children){
    adults = parseInt(adults[0]);
    childs = 0;
    children.forEach(child=>{
        if(child != null) childs++
    });
    return {'adults':adults,'children':childs}
  }

  /*
  *
  *
  * @get paxes For Booking Rules
  *
  *
  */
  function getpaxes(adults,children){
    var incre = 1;var relPaxDist = '';paxid=1;var pax='';
    adults.forEach(items => {
      for(var item of items){
        var relPaxes = '<RelPaxDist><RelPaxes>';
        var relpax = '';
        for(i=0;i< parseInt(item);i++){
          pax += '<Pax IdPax="'+paxid+'"><Age>30</Age></Pax>';
          relpax += '<RelPax IdPax="'+paxid+'"/>'; 
          paxid++;
        }
        i=1;
        children.forEach(items => {
          if(i==incre){
            items.forEach(child => {
              if(child != null){
                pax += '<Pax IdPax="'+paxid+'"><Age>'+child+'</Age></Pax>';
                relpax += '<RelPax IdPax="'+paxid+'"/>'; i++;
                paxid++;
              }
            });
          };
          i++
        });
        
        relPaxes += relpax+'</RelPaxes></RelPaxDist>';
      };
      relPaxDist +=relPaxes;
      incre++;
    });
    return {pax,relPaxDist}
  }

  /*
  *
  *
  * @get paxes For Booking
  *
  *
  */
  function getpaxesForBooking(req){
    var adults = req.body.adults;
    var children = req.body.children;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var holder = '';
    var incre = 1;var relPaxDist = '';paxid=1;var pax='';holdercounter=0;
    adults.forEach(items => {
      var relPaxes = '<RelPaxDist><RelPaxes>';
      var relpax = '';
      for(var item of items){
          pax += '<Pax IdPax="'+paxid+'"><Name>'+item["name"]+'</Name><Surname>'+item["surename"]+'</Surname><Age>'+item["age"]+'</Age>';
          if(req.body.holder == holdercounter){
             pax +='<PhoneNumbers><PhoneNumber>'+phone+'</PhoneNumber></PhoneNumbers><Email>'+email+'</Email><Address>'+address+'</Address><City>Palma de Mallorca</City><Country>Spain</Country><PostalCode>05278</PostalCode><Nationality>EG</Nationality>';
             holder = '<RelPax IdPax="'+paxid+'"/>'
          }
          pax += '</Pax>';
          relpax += '<RelPax IdPax="'+paxid+'"/>'; 
          paxid++;holdercounter++;
      };
      i=1;
        children.forEach(items => {
          if(i==incre){
            items.forEach(child => {
              if(child != null){
                pax += '<Pax IdPax="'+paxid+'"><Name>'+child["name"]+'</Name><Surname>'+child["surename"]+'</Surname><Age>'+child["age"]+'</Age></Pax>';
                relpax += '<RelPax IdPax="'+paxid+'"/>'; 
                paxid++;
              }
            });
          };
          i++
        });
        
      relPaxes += relpax+'</RelPaxes></RelPaxDist>';
      relPaxDist +=relPaxes;
      incre++;
    });
    return {pax,relPaxDist,holder}
  }

  /*
  *
  * handel cancel police rlues
  * 
  */

  function handelCancelPoliceRules(allrules){
    var rules = [];
    allrules.forEach(rule=>{
      var dateFrom = typeof rule['$']['DateFrom'] != 'undefined' ? rule['$']['DateFrom'] :'';
      var timeFrom = typeof rule['$']['DateFrom'] != 'undefined' ? rule['$']['DateFromHour']:'';

      var dateTo = typeof rule['$']['DateTo'] != 'undefined' ? rule['$']['DateTo'] : '';
      var timeTo = typeof rule['$']['DateTo'] != 'undefined' ? rule['$']['DateToHour']:'';

      var type = PolicyRulesType(rule['$']['Type']);
      var fixedPrice = rule['$']['FixedPrice'] ?? 0;
      var percentPrice = rule['$']['PercentPrice'] ?? 0;
      var nights = rule['$']['Nights'] ?? 0;
      var typeNights = rule['$']['ApplicationTypeNights'] ?? '';
      var firstNights = 0; var mostExpensiveNight=0;
      if(typeNights == 'FirstNight') firstNights = rule['$']['FirstNightPrice'] ?? 0;
      else if(typeNights == 'MostExpensiveNight') mostExpensiveNight = rule['$']['MostExpensiveNight'] ?? 0; 
      rules.push({dateFrom,timeFrom,dateTo,timeTo,type,fixedPrice,percentPrice,nights,typeNights,firstNights,mostExpensiveNight});
    });
    return rules;
  }
  

/*
  *
  *
  * get object size
  *
  *
  */
  Object.size = function(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };
  