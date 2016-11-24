var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./dbTools');
var Group = db.Group;
var User = db.User;
var Event = db.Event;
var Notification = db.Notification;

exports.getNotificationsByUser = function(req,res,next){

    if(req.session.user){
        console.log('I HAVE A USER');
        var user = req.session.user;
        Notification
            .findAll({
                where: {memberId: user.id},
                order: ['createdAt']
            })
            .then(function(notifications) {
                console.log(notifications);
                req.notifications = notifications;
                next();
            });
    }else{
        next();
    }
};