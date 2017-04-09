'use strict';

/*
* This module handles notification related routes on the Android client.
* */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../../middleware/dbTools');
var authTools = require('../../middleware/authTools');

var Notification = db.Notification;
var User = db.User;

router.get('/:userid',
    getNotificationsByUserId);
router.get('/',function(req,res,next){
    res.send('nothing here');
});


/**
 * Gets and sends the notifications belonging to a user.
 * @param req
 * @param res
 * @param next
 */
function getNotificationsByUserId(req, res, next){
    var userid = req.params.userid;

    User
        .findOne({
            where:{'google.id':userid}
        })
        .then(function(member){
            console.log(userid);
            Notification
                .findAll({
                    where: {memberId: member.id},
                    order: ['createdAt']
                })
                .then(function(notifications){
                    res.send({
                        notifications: notifications
                    });
                }, function(){
                    next();
                });
        }, function(){
            next()
        });
}

module.exports = router;