var cron = require('node-cron');
var update = require('../controllers/juniper/juniperUpdate');
var giata = require('../controllers/giata/giataData');

// cron.schedule('* * * * *', (req,res) => {
//   var callback = function(data){console.log(data); }
//   update.updateCity(req,res,callback);
// });

// cron.schedule('* * * * *', (req,res) => {
//   update.updateHotelPortfolio(req,res);
// });

// cron.schedule('* * * * *', (req,res) => {
// var callback = function(data){console.log(data); }
//   giata.startInfoService(req,res,callback);
// });

// cron.schedule('* * * * *', (req,res) => {
// var callback = function(data){console.log(data); }
//   giata.startMultipeCodesService(req,res,callback);
// });

// cron.schedule('* * * * *', (req,res) => {
//   console.log('test');
// });