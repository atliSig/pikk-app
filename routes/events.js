'use strict';
var fecha = require('fecha');
var express = require('express');
var router = express.Router();
var session = require('express-session');
var groups = require('../models/groups');
var db = require('../middleware/dbTools');
var authTools = require('../middleware/authTools');
var apiTools= require('../middleware/apiTools');
var pikkTools= require('../middleware/pikkTools');
var groupTools= require('../middleware/groupTools');
var eventTools= require('../middleware/eventTools');

var notificationTools = require('../middleware/notificationTools');

var Group = db.Group;
var User = db.User;
var Event = db.Event;
var Notification = db.Notification;

module.exports = router;


//THIS ROUTE MUST BE AT TOP
//----------ROUTING FOR CHOOSE------------//
router.use('/:eventid/choose',
    authTools.isLoggedIn,
    apiTools.queryByTags,
    apiTools.doSearch,
    //pikkTools.filterByDistance,
    getChoose
);

router.get('/createevent',
    showCreateEvent);

router.post('/createevent',
    createEvent);

router.get('/:eventid',
    eventTools.choosePlace, //gefur req.picked_place - BOOL
    eventTools.getUnDecidedMembers, //gefur req.decidedMembers - []user
    eventTools.getDecidedMembers, //gefur req.decidedMembers - []user
    eventTools.checkIfEventReady, //gefur req.eventReady - BOOL
    apiTools.queryByIds, //gefur results fra APA
    showEventPage);

router.get('/',
    displayEventPage);

function getChoose(req,res,next){
    var user = req.session.user;
    //results inniheldur selectada stadi
    res.render('choose', { user:user, title:'Choose', event_id: req.params.eventid, results: req.search_result, groups: req.user_groups, events: req.user_events});
}

router.get('/createevent', authTools.isLoggedIn,showCreateEvent);
router.post('/createevent', authTools.isLoggedIn, createEvent);
router.use('/:eventid', authTools.isLoggedIn, eventTools.choosePlace, showEventPage);
router.get('/',authTools.isLoggedIn, displayEventPage);


//-------handlers------//

function getChoose(req,res,next){
    var user = req.session.user;
    res.render('choose', {
        title           : 'Choose',
        results         : req.search_result,

        event_id        : req.params.eventid,


        user            : user,
        groups          : req.user_groups,
        events          : req.user_events,
        notifications   : req.notifications
    });
}

function showCreateEvent(req, res, next) {
    var user = req.session.user;
    res.render('createevent',{
        user            : user,
        groups          : req.user_groups,
        events          : req.user_events,
        notifications   : req.notifications
    });
}

function createEvent(req, res, next){
    var user = req.session.user;
    var title = req.body.title;
    var description = req.body.description;
    var deadline = fecha.format(new Date(req.body.deadline),'YYYY-MM-DD HH:mm:ss')+' +02:00';
    var toe = fecha.format(new Date(req.body.toe),'YYYY-MM-DD HH:mm:ss')+' +02:00';
    var currentgroup = req.session.currentGroup;

    var groupid = req.session.currentGroup.id;
    Group.findOne({
            where: {id: groupid},
            include: [{model:User, as:'member'}]
        }
    ).then(function(group){
        //Create the event
        Event.create({
            title: title,
            description: description,
            deadline: deadline,
            toe: toe,
            groupId: groupid
        })
            .then(function (event) {
                var groupmembers = group.member;

                //add all groupmembers to the event
                event
                    .addMember(groupmembers)
                    .then(function(members){

                        var notificationArray = [];
                        var url = '/e/'+event.id;
                        var content = user.first_name + ' invited you to the event '+title
                            +' with your group '+currentgroup.name +'!';

                        groupmembers.forEach(function (member) {
                            if(member.dataValues.id != user.id)
                                notificationArray.push({
                                    url     : url,
                                    memberId: member.dataValues.id,
                                    content : content
                                });
                        });
                        // Notify all members
                        Notification
                            .bulkCreate(notificationArray)
                            .then(function(notification){
                                res.redirect(url);
                            });
                    });
            },function(err){
                return next('no thing'+err);
            });
    }, function(err){
        return next('no group'+err);
    });
}

function showEventPage(req, res, next){
    var user = req.session.user;
    var eventid = req.params.eventid;
    req.session.user.current_event_id = eventid;
    console.log('the whole shabang');
    console.log(req.hasSelected);
    console.log(req.decidedMembers);
    console.log(req.unDecidedMembers)
    console.log(req.eventReady);
    // console.log(req.search_result);

    Event.findOne({
        where:{
            id: eventid
        },
        include: [{
            model: User,
            as: 'member'
        }]
    })
        .then(function(event){
                res.render('eventlayout', {
                    event           : event,

                    user            : user,
                    groups          : req.user_groups,
                    events          : req.user_events,
                    notifications   : req.notifications,
                    eventReady      : req.eventReady,
                    decidedMembers  : req.decidedMembers,
                    hasSelected     : req.hasSelected
                });
            }
        );
}

function displayEventPage(req,res,next){
    var user = req.session.user;
    Event
        .findAll({
            include:[{model: User, as: 'member', where: {'google.id': user.google.id}}]
        })
        .then(function(events) {
            res.render('eventlist',{
                title: 'My groups',

                user            : user,
                events          : events,
                groups          : req.user_groups,
                notifications   : req.notifications
            });
        });
}