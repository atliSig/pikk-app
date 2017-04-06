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
var index   = require('./index');
var users   = require('./users');
var groups  = require('./groups');
var auth    = require('./auth');
var events  = require('./events');
var notifications = require('./notifications');
function addAndroidUser(req, res, next){
    //req.session.user = require('./config/dummyUser.json');
    var userId = req.query.userId;
    if ("undefined" === typeof userId){
        userId = req.body.userId;
    }
    console.log(userId);
    User
        .findOne({
            where:{'google.id':userId}
        })
        .then(function(member){
            req.session.user = member;
            next();
        }, function () {
            next();
        });
}


// router.use('/', index);
// routes for android client

router.use('/', index);
router.use('/auth', auth);
// router.use('/auth', auth);
router.use('/u',
    // authTools.isLoggedIn,
    // addDummyUser,
    addAndroidUser,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    // notificationTools.getNotificationsByUser,
    users);

router.use('/g',
    // authTools.isLoggedIn,
    // addDummyUser,
    addAndroidUser,
    groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    // notificationTools.getNotificationsByUser,
    groups);

router.use('/e',
    // authTools.isLoggedIn,
    // addDummyUser,
    // groupTools.getGroupsByUser,
    addAndroidUser,
    eventTools.getEventsByUser,
    // notificationTools.getNotificationsByUser,
    events);

router.use('/n',
    // addDummyUser,
    //addAndroidUser,
    notifications
    );

router.use(function(req, res, next) {
    var err = new Error('API Service Not Found');
    err.status = 404;
    next(err);
});

router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {},
        user: req.session.user
    });
});


module.exports = router;