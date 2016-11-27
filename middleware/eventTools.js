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
            }, function(){
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
        }, function () {
            next();
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
            if(evmember.selectedPlace!=null){
                req.hasSelected = true;
                next();
            }else if(req.body.picked_place != null){
                evmember.update({
                        selectedPlace: req.body.picked_place
                    }
                ).then(function (update) {
                    req.hasSelected = true;
                    next();
                });
            }
            else{
                req.hasSelected = false;
                next();
            }
        },
        function (err) {
            req.hasSelected=false;
            next();
        });
};


exports.getDecidedMembers = function(req, res, next){
    var eventid = req.params.eventid;
    EventMember.getDecidedMembers(
        eventid, function(members){
            req.decidedMembers = members;
            next();
        },function (err) {
            next();
        }
    );
};

exports.getUnDecidedMembers = function(req, res, next){
    var eventid = req.params.eventid;
    EventMember.getUnDecidedMembers(
        eventid, function(members){
            req.unDecidedMembers = members;
            next();
        }, function(err){
            next();
        }
    );

};


exports.checkIfEventReady = function (req, res, next) {
    EventMember
        .findAll({
            where:{
                $and:[{
                    eventId: req.params.eventid
                }]
            }
        })
        .then(function(evmember){
            isReady = false;
            count = 0;
            evmember.forEach(function (memb) {
                if(memb.dataValues.selectedPlace === null)
                    count++;

            });
            if(count ==0 && evmember.length != 0)
                isReady = true;
            Event
                .findOne({
                    where: {
                        id: req.params.eventid
                    }
                })
                .then(function(event)
                {
                    event
                        .update({
                            isReady: isReady
                        })
                        .then(function () {
                            req.eventReady= isReady;
                            next();
                        },function () {
                            next();
                            }
                        );
                }, function () {
                    next();
                });
        }, function(){
            next();
        });
};