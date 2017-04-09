'use strict';

/*
* This modules handles all routes made by the Android client.
* */
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


/**
 * This middleware adds the requested user to the req.session.user object.
 * This is not safe because we add it by google ID without any authentication.
 * The reason we did this can bee seen in the (/api)/auth router.
 * @param req
 * @param res
 * @param next
 */
function addAndroidUser(req, res, next){

    var userId = req.query.userId;
    if ("undefined" === typeof userId){
        userId = req.body.userId;
    }
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

// ---- Routes for Android client ----- //
router.use('/', index);
router.use('/auth', auth);
router.use('/u',
    addAndroidUser,
    users);

router.use('/g',
    addAndroidUser,
    groupTools.getGroupsByUser,
    groups);

router.use('/e',
    addAndroidUser,
    eventTools.getEventsByUser,
    events);

router.use('/n',
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