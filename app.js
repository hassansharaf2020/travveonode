var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = 3000
var indexRouter = require('./routes/index');
var statticRouter = require('./routes/api/v1/static');
var searchRouter = require('./routes/api/v1/search');
var update = require('./controllers/juniper/juniperUpdate');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/static', statticRouter);
app.use('/api/v1/search', searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var cron = require('node-cron');
// cron.schedule('* * * * *', (req,res) => {
//   update.updateCity(req,res);
// });

// cron.schedule('60 24 7 * *', (req,res) => {
//   update.updateHotelPortfolio(req,res);
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
