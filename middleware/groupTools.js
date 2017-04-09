'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./dbTools');
var Group = db.Group;
var User = db.User;
var Event = db.Event;

exports.getGroupsByUser = function(req,res,next){
    if(req.session.user){
        var user = req.session.user;
        Group
            .findAll({
                include:[{model: User, as: 'member', where: {'google.id': user.google.id}}]
            })
            .then(function(groups) {
                req.user_groups = groups;
                next();
            }, function () {
                next();
            });
    }else{
        next();
    }
};

exports.getFullGroupsByUser = function(req, res, next){
    if(req.session.user){
        var user = req.session.user;
        User.getGroupsAndFriends(user.google.id,
            function(groupMembers)
            {

                }, function(){ next();} );
    }
    else {
        next()
    }
};