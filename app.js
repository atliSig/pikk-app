var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
require('dotenv').config();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');

passport.use(new LocalStrategy(
    function(username, password, cb) {
      db.users.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    })
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  console.log('im here now');
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

//REQUIRE ROUTES HERE//
var index  = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(passport.initialize());
app.use(passport.session());

app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//added for npm component reference from pug
app.use(require('less-middleware')(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(passport.initialize());
app.use(passport.session());

//ADD ROUTE HANDLER HERE//
app.use('/', index);
// app.use('/signup', users);
app.use('/u', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
