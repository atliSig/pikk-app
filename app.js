var express = require('express')
    path = require('path')
    favicon = require('serve-favicon')
    logger = require('morgan')
    cookieParser = require('cookie-parser')
    bodyParser = require('body-parser')
    compression = require('compression');

var passport = require('passport');
var session = require('express-session');
var db = require('./middleware/dbTools');
db.init();
require('./config/apiPassport')(passport);
require('./config/passport')(passport);
require('dotenv').config();

var Sequelize = require('sequelize');
var pool = {max: 30, min: 0, idle: 10000};

var DATABASE = process.env.DATABASE_URL;
var sequelize = new Sequelize(DATABASE, pool);


var authTools = require('./middleware/authTools');
var eventTools = require('./middleware/eventTools');
var groupTools = require('./middleware/groupTools');
var notificationTools = require('./middleware/notificationTools');
var pikkTools = require('./middleware/pikkTools');


//REQUIRE ROUTES HERE//
var api     = require('./routes/api/api');
var index   = require('./routes/index');
var users   = require('./routes/users');
var groups  = require('./routes/groups');
var auth    = require('./routes/auth');
var events  = require('./routes/events');

var app = express();


app.use(cookieParser());
//session is required for passport
app.use(session({
  secret: 'pikk',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//added for npm component reference from pug
app.use(require('less-middleware')(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'node_modules')));


//Initialize database associations
db.init();



//ADD ROUTE HANDLER HERE//
app.use('/api', api);
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/', index);
app.use('/auth', auth);
app.use('/u',
    authTools.isLoggedIn,

    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    notificationTools.getNotificationsByUser,
    users);

app.use('/g',
    authTools.isLoggedIn,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    notificationTools.getNotificationsByUser,
    groups);

app.use('/e',
    authTools.isLoggedIn,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    notificationTools.getNotificationsByUser,
    events);


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
      error: err,
      user: req.session.user
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error",{
    message: err.message,
    error: {},
    user: req.session.user
  });
});


module.exports = app;