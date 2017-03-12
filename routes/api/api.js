// /**
//  * Created by Atli on 10.3.2017.
//  */
// 'use strict';
//
// // demo Route (GET http://localhost:8080)
// // ...
//
// // pass passport for configuration
var express = require('express');
var db = require('../../middleware/dbTools');
var User = db.User;
var authEnv = require('../../config/auth');
// bundle our routes
var router = express.Router();



var authTools = require('../../middleware/authTools');
var eventTools = require('../../middleware/eventTools');
var groupTools = require('../../middleware/groupTools');
var notificationTools = require('../../middleware/notificationTools');
var pikkTools = require('../../middleware/pikkTools');



//Require routes here
var index   = require('./../index');
var users   = require('./users');
var groups  = require('./groups');
var auth    = require('./../auth');
var events  = require('./events');
function addDummyUser(req, res, next){
    if(req.session.user) next();
    req.session.user = require('./config/dummyUser.json');
    next();
}

// routes for android client
// router.use('/', index);
// router.use('/auth', auth);
router.use('/u',
    // authTools.isLoggedIn,
    addDummyUser,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    notificationTools.getNotificationsByUser,
    users);

router.use('/g',
    // authTools.isLoggedIn,
    addDummyUser,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    notificationTools.getNotificationsByUser,
    groups);

router.use('/e',
    // authTools.isLoggedIn,
    addDummyUser,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    notificationTools.getNotificationsByUser,
    events);

router.use(function(req, res, next) {
    var err = new Error('API service Not Found');
    err.status = 404;
    next(err);
});


module.exports = router;