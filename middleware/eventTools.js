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
                req.hasSelected = true;
                next();
            }else{
                evmember.update({
                        selectedPlace: req.body.picked_place
                    }
                ).then(function (update) {
                    console.log(req.body.picked_place);
                    req.hasSelected = true;
                    next();
                });
            }
        },
        function (err) {
            req.hasSelected=false;
            console.log('I hae not don notinh');
            next();
        });
};


exports.getDecidedMembers = function(req, res, next){
    User.findAll({
        include: [{
            model: EventMember,
            as: 'member',
            where: {
                $and: [{
                    eventId: req.params.eventid
                }, {
                    selectedPlace: {$ne: null}
                }]
            }
        }]
    }).then(function(users){
        req.decidedMembers = users;
        next();
    }, function(){
        next();
    });
};

exports.checkIfEventReady = function (req, res, next) {
    EventMember
        .findAll({
            where:{
                $and:[{
                    eventId: req.params.eventid,
                    selectedPlace: null
                }]
            }
        })
        .then(function(evmember){
            if(evmember.length == 0){
                Event
                    .update({
                        isReady: true
                    })
                    .then(function(ee){
                        req.eventReady= true;
                        next();
                    });
            }
            else{
                req.eventReady=false;
                next();
            }
        });
};