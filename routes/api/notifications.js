'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../../middleware/dbTools');
var authTools = require('../../middleware/authTools');

var Notification = db.Notification;

router.get('/:userid',
    getNotificationsByUserId);
router.get('/',function(req,res,next){
    res.send('nothing here');
});



function getNotificationsByUserId(req, res, next){
    var userid = req.params.userid;
    Notification
        .findAll({
            where: {memberId: userid},
            order: ['createdAt']
        })
        .then(function(notifications) {
            res.send(notifications);
        }, function () {
            next();
        });
}

module.exports = router;