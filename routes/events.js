'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var groups = require('../lib/groups');
var db = require('../middleware/dbTools');
var authTools = require('../middleware/authTools');

var Group = db.Group;
var User = db.User;
var Event = db.Event;

module.exports = router;

router.get('/createevent', authTools.isLoggedIn, showCreateEvent);
router.post('/createevent', authTools.isLoggedIn, createEvent);
router.get('/:eventid', authTools.isLoggedIn, showEventPage);

//-------handlers------//

function showCreateEvent(req, res, next) {
    var user = req.session.user;
    res.render('createevent',{user: user});
}

function createEvent(req, res, next){
    var user = req.session.user;
    //console.log(req.session.currentGroup);
    //console.log(user);
    var title = req.body.title;
    var description = req.body.description;
    var deadline = req.body.deadline || '2004-10-19 10:23:54+02';
    var toe = req.body.toe || '2004-10-19 10:23:54+02';
    var group = req.session.currentGroup;
    console.log(group.member);
    Event.create({
        title: title,
        description: description,
        deadline: deadline,
        toe: toe
    }).then(function (event) {
            User.findOne({
                where: {id:user.id}
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