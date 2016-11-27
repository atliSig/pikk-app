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
        var user = req.session.user;
        Notification
            .findAll({
                where: {memberId: user.id},
                order: ['createdAt']
            })
            .then(function(notifications) {
                req.notifications = notifications;
                next();
            }, function () {
                next();
            });
    }else{
        next();
    }
};

exports.deleteIfOwner = function(req,res,next){
    var notificationId = req.body.notifyid;
    var user = req.session.user;
    var url =req.body.notifyurl;
    Notification.destroy({
        where: {$and:[{memberId: user.id}, {id: notificationId}]}
    }).then(function(notification){
        res.redirect(url);
    }, function(){
        next();
    });
};