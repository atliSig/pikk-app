/**
 * Created by atli on 23.11.2016.
 */
/**
 * Created by atli on 23.11.2016.
 */

var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./dbTools');
var Group = db.Group;
var User = db.User;
var Event = db.Event;
var EventMember = db.EventMember;

exports.getEventsByUser = function(req,res,next){
    if(req.session.user){
        var user = req.session.user;
        Event
            .findAll({
                include:[{model: User, as: 'member', where: {'google.id': user.google.id}}]
            })
            .then(function(events) {
                req.user_events = events;
                next();
            });
    }else{
        next();
    }
};

exports.getEventsByGroup = function(req,res,next){
    var groupId = req.params.groupid;
    Group.findOne({
        where:{
            id: groupId
        },
        include: [{model: User, as: 'member'}]
    }).then(
        function(group){
            group.getEvents().then(
                function(events){
                    res.render('pickGroup',{

                    })
                }
            )
        }
    )
};

//Chooses a place for a event member only if he has never chosen before
exports.choosePlace = function(req,res,next) {
    EventMember.findOne({
            where: {
                $and: [{memberId: req.session.user.id}, {eventId: req.params.eventid}]
            }
        }).then(
            function (evmember) {
                if(evmember.selectedPlace){
                    next();
                }else{
                    evmember.update({
                            selectedPlace: 1337
                        }
                    ).then(function (update) {
                        console.log('yo');
                        next();
                    });
                }
            },
            function (err) {
                //Error parsing?
                next();
            });
};