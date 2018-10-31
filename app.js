var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var flash=require('connect-flash');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var expressValidator=require('express-validator');
var mongoose = require('mongoose'); 
mongoose.connect('mongodb://admin:admin@ds147864.mlab.com:47864/flightassistant');



var index = require('./routes/index');
var signup = require('./routes/signup');
var login = require('./routes/login');
var flight = require('./routes/flight');
var airport = require('./routes/airport');
var history = require('./routes/history');
var cab = require('./routes/cab');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
	secret:'s3cr3t',
	saveUninitialized:false,
	resave:false
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/signup', signup);
app.use('/login', login);
app.use('/flight', flight);
app.use('/airport', airport);
app.use('/history', history);
app.use('/cab', cab);


app.get('/logout',function(req,res){
    req.logout();
    req.app.locals.user=null;
    req.flash('error','You have been logged out');
    res.redirect('/'); 
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
