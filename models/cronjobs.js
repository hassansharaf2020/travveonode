var cron = require('node-cron');
var update = require('../controllers/juniper/juniperUpdate');
var giata = require('../controllers/giata/giataData');
var config = require('../config');

//  cron.schedule('* * * * *', (req,res) => {
//    var callback = function(data){console.log('updateCity' + data); }
//    update.updateCity(req,res,callback);
//  });

//  cron.schedule('*/2 * * * *', (req,res) => {
//    var callback = function(data){console.log('updateHotelPortfolio' + data); }
//    update.updateHotelPortfolio(req,res);
//  });

// cron.schedule('* * * * *', (req,res) => {
//   var callback = function(data){console.log('updateZoneList' + data); }
//   update.updateZoneList(req,res);
// });

// cron.schedule('* * * * *', (req,res) => {
//   var callback = function(data){console.log('update content' + data); }
//   update.updateHotelContent(req,res,callback);
// });
 
if(config.env != 'live'){
    // cron.schedule('* * * * *', (req,res) => {
    // var callback = function(data){console.log('startInfoService' + data); }
    // giata.startInfoService(req,res,callback);
    // });

    // cron.schedule('*/2 * * * *', (req,res) => {
    // var callback = function(data){console.log('startMultipeCodesService' + data); }
    // giata.startMultipeCodesService(req,res,callback);
    // });
}

// cron.schedule('* * * * *', (req,res) => {
//   console.log('test');
// });