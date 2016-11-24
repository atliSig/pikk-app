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
            });
    }else{
        next();
    }
};

exports.deleteIfOwner = function(req,res,next){
    console.log('delete if owner');
    var notificationId = req.body.notifyid;
    var user = req.session.user;
    var url =req.body.notifyurl;
    console.log('5545454 '+notificationId);
    console.log(user.id);
    console.log(url);
    Notification.destroy({
        where: {$and:[{memberId: user.id}, {id: notificationId}]}
    }).then(function(notification){
        res.redirect(url);
    });
}