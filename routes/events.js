'use strict';
var fecha = require('fecha');
var express = require('express');
var router = express.Router();
var session = require('express-session');
var groups = require('../lib/groups');
var db = require('../middleware/dbTools');
var authTools = require('../middleware/authTools');
var apiTools= require('../middleware/apiTools');
var pikkTools= require('../middleware/pikkTools');
var groupTools= require('../middleware/groupTools');
var eventTools= require('../middleware/eventTools');

var Group = db.Group;
var User = db.User;
var Event = db.Event;

module.exports = router;


//THIS ROUTE MUST BE AT TOP
//----------ROUTING FOR CHOOSE------------//
router.use('/choose',
    authTools.isLoggedIn,
    apiTools.queryByTags,
    apiTools.doSearch,
    //pikkTools.filterByDistance,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    getChoose
);
function getChoose(req,res,next){
    var user = req.session.user;
    res.render('choose', { user:user, title:'Choose', results: req.search_result, groups: req.user_groups, events: req.user_events});
}

router.get('/createevent', authTools.isLoggedIn, showCreateEvent);
router.post('/createevent', authTools.isLoggedIn, createEvent);
router.get('/:eventid', authTools.isLoggedIn, showEventPage);
router.get('/',authTools.isLoggedIn, displayEventPage);

//-------handlers------//

function showCreateEvent(req, res, next) {
    var user = req.session.user;
    res.render('createevent',{user: user});
}

function createEvent(req, res, next){
    var user = req.session.user;
    var title = req.body.title;
    var description = req.body.description;
    console.log(req.body.deadline);
    var deadline = fecha.format(new Date(req.body.deadline),'YYYY-MM-DD HH:mm:ss')+' +02:00';
    var toe = fecha.format(new Date(req.body.toe),'YYYY-MM-DD HH:mm:ss')+' +02:00';
    var group = req.session.currentGroup;
    Event.create({
        title: title,
        description: description,
        deadline: deadline,
        toe: toe
    }).then(function (event) {
        User.findOne({
            where: {'google.id':user.google.id}
        }).then(function(user){
            event.addMember(user,{isAdmin:false});
            res.redirect(event.id);
        });
    },function(err){
        return next('no thing'+err);
    });

    // Group.findOne({
    //         where: {id: groupid},
    //         include: [{model:User, as:'member'}]
    //     }
    // ).then(function(group){
    //     //console.log(group);
    //     Event.create({
    //         title: title,
    //         description: description,
    //         deadline: deadline,
    //         toe: toe
    //     })
    //         .then(function (event) {
    //             var member = group.member;
    //             event.addMember(member)
    //                 .then(function(members){
    //                     res.redirect(event.id);
    //                 });
    //         },function(err){
    //            return next('no thing'+err);
    //         });
    // }, function(err){
    //     return next('no group'+err);
    // });
}

function showEventPage(req, res, next){
    var user = req.session.user;
    var eventid = req.params.eventid;

    Event.findOne({
        where:{
            id: eventid
        },
        include: [{model: User, as: 'member'}]
    })
        .then(function(event){
                res.render('eventlayout', {
                    user: user,
                    event:event});
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
                user: user,
                events: events,
            });
        });
}
