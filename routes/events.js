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

// router.get('/', authTools.isLoggedIn, displayGroupPage);
router.get('/createevent', authTools.isLoggedIn, showCreateEvent);
router.post('/createevent', authTools.isLoggedIn, createEvent);
router.get('/:eventid', authTools.isLoggedIn, showEventPage);
// router.post('/:groupid/addMember', authTools.isLoggedIn, addMember);

//-------handlers------//

function showCreateEvent(req, res, next) {
    var user = req.session.user;

    res.render('createevent',{user: user});
}

function createEvent(req, res, next){
    var user = req.session.user;

    var title = req.body.title || 'Event Title';
    var description = req.body.description || 'Nice descor';
    var deadline = req.body.deadline || '2016-11-20 05:54:35.496+00';
    var toe = req.body.toe || '2016-11-20 05:54:35.496+00';
    var groupid = 26;

    Group.findOne({
            where: {id: groupid},
            include: [{model:User, as:'member', }]
        }
    ).then(function(group){
        //console.log(group);
        Event.create({
            title: title,
            description: description,
            deadline: deadline,
            toe: toe
        })
            .then(function (event) {
                var member = group.member;
                event.addMember(member)
                    .then(function(members){
                        res.redirect(event.id);
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

    Event.findOne({
        where:{
            id: eventid
        },
        include: [{model: User, as: 'member'}]
    })
        .then(function(event){
                    res.render('eventpage', {
                        user: user,
                        event:event});
                }
            );
}