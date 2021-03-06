'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var groups = require('../models/groups');
var db = require('../middleware/dbTools');
var authTools = require('../middleware/authTools');
var groupTools= require('../middleware/groupTools');
var eventTools= require('../middleware/eventTools');
var userTools = require('../middleware/userTools');
var notificationTools = require('../middleware/notificationTools');
var Group = db.Group;
var User = db.User;
var Event = db.Event;
var Notification = db.Notification;

module.exports = router;

router.get('/',
    displayGroupPage);

router.get('/groups',
    sendGroupPage);

router.get('/creategroup',
    showCreateGroup);

router.get('/:groupid',
    showGroupPage);

router.post('/creategroup',
    createGroup);

router.post('/:groupid/addMember',
    addMember,
    showGroupPage);



//\\\\\\\\\\functions//////////\\
function addMember(req, res, next){
    //addmember is a body variable from another route
    var addmember;
    if(req.body.addmember){
        addmember =  req.body.addmember;
    }
    var user = req.session.user;
    var groupid = req.params.groupid;
    var email = req.body.email;

    var errors = [];
    Group.findOne({where:{id:groupid}})
        .then(function(group){
            User.findOne({
                where:{
                    $or: [{'email': email},{'google.id':addmember}]
                },
                required: true
            })
                .then(function(member){

                    if(member == null)
                    {
                        errors.push('User not found');
                        req.errors = errors;
                        next();
                    }
                    else {
                        group
                            .addMember(member)
                            .then(function () {
                                var url = '/g/'+groupid;
                                var content = user.google.displayName +' just added you to the group '+group.name+'!';
                                var memberId = member.id;
                                Notification.create({
                                    url: url,
                                    content: content,
                                    memberId: memberId
                                })
                                    .then(function(){
                                            res.redirect('/g/' + groupid);
                                        },
                                        function(){
                                            res.render('groupprofile', {
                                                errors: errors,
                                                user: user,
                                                events: req.user_events,
                                                groups: req.user_groups,
                                                notifications: req.notifications
                                            });
                                        });

                            }, function (err) {
                                errors.push('Could not add a member');
                                res.render('groupprofile', {
                                    errors: errors,
                                    user: user,
                                    events: req.user_events,
                                    groups: req.user_groups,
                                    notifications: req.notifications
                                });
                            });
                    }

                }, function(err){
                    errors.push('User not found');
                    req.errors = errors;
                    res.render('groupprofile', {
                        errors: errors,
                        user: user,
                        events: req.user_events,
                        groups: req.user_groups,
                        notifications: req.notifications
                    });

                });
        }, function(err){
            errors.push(err);
            res.render('groupprofile', {
                errors: errors,
                user: user,
                events: req.user_events,
                groups: req.user_groups,
                notifications: req.notifications
            });
        });
}

//Shows the profile of a specific group
function showGroupPage(req, res, next) {

    var user = req.session.user;
    var groupid = req.params.groupid;
    var inGroup = false;
    var errors= req.errors;
    Group
        .findOne({
            where: {
                id: groupid
            },
            include: [{
                model: User,
                as: 'member'}]
        })
        .then(
            function(group){
                var members = group.member;
                for(var i in members){
                    if(members[i].dataValues.google.id == user.google.id)
                    {
                        inGroup = true;
                        break;
                    }
                }
                if(inGroup){
                    group
                        .getEvents()
                        .then(function(events){

                            req.session.currentGroup=group;
                            res.render('groupprofile', {
                                group: group,
                                errors: errors,
                                user: user,
                                members: members,
                                events: events,
                                groups: req.user_groups,
                                notifications: req.notifications
                            });
                        });
                }
                else{
                    res.redirect('/');
                }
            }
        );
}

//Displays groups which the user is a member of.
function displayGroupPage(req, res, next){

    console.log(req.user_events);
    res.render('grouplist',{
        title: 'My groups',

        user            : req.session.user,
        groups          : req.user_groups,
        events          : req.user_events,
        invited_user_id : req.query.invited,
        notifications   : req.notifications
    });
}

//Rendering the creategroup view
function showCreateGroup(req, res, next){
    var user = req.session.user;
    User.getFriends(user.id, function(friends){
        res.render('creategroup', {
            title: 'Create Group',
            friends: friends,

            user            : user,
            events          : req.user_events,
            groups          : req.user_groups,
            notifications   : req.notifications
        });
    },
        function(err){
            //if error occurs
        next();
    });

}

//Create group handler
function createGroup(req, res, next){
    var user = req.session.user;
    var body = req.body;
    var errors = [];
    var members = [];
    var bodyMembers = req.body.members;
    bodyMembers.splice(0,1);
    bodyMembers = JSON.parse(bodyMembers);

    ///----Check for members in the form----////
    bodyMembers.forEach(function(member){

        if (member.length > 0 && member !== user.email && member!=='[]'){
            members.push(member);
        }
    });
    var groupname = body.groupname;
    var description = body.description;

    if(members.length === 0) {
        errors.push('Group must have at least one other member');
    }

    //Create group if no errors
    if(errors.length === 0) {
        //Create the group
        Group.create({
            name: groupname,
            description: description
        })
            .then(function (group) {
                //find group creator
                User.findOne({
                    where: {'google.id': user.google.id}
                })
                    .then(function (user) {
                        //add the group creator as admin
                        group
                            .addMember(user,{
                                isAdmin: true
                            })
                            .then(function () {
                                //find the users that the admin wanted in the group
                                User
                                    .findAll({
                                        where: {
                                            email: {$in: members}}
                                    })
                                    .then(function(newMembers) {
                                        var url = '/g/'+group.id;
                                        var content = user.google.displayName +' added you to the group '
                                            + group.name;
                                        var notificationArray = [];

                                        //Notify users when being added
                                        newMembers.forEach(function (member) {
                                            if(member.dataValues.id != user.id)
                                                notificationArray.push({
                                                    url: url,
                                                    content: content,
                                                    memberId: member.dataValues.id
                                                });
                                        });

                                        group
                                            .addMember(newMembers)
                                            .then(function (membeers) {
                                                Notification
                                                    .bulkCreate(notificationArray)
                                                    .then(function () {
                                                        res.redirect('/g/' + group.id);
                                                    });

                                            }, function () {
                                                res.render('creategroup', {
                                                    errors: errors,
                                                    user: user,
                                                    events: req.user_events,
                                                    groups: req.user_groups,
                                                    notifications: req.notifications
                                                });
                                            });
                                    },function () {
                                        res.render('creategroup', {
                                            errors: errors,
                                            user: user,
                                            events: req.user_events,
                                            groups: req.user_groups,
                                            notifications: req.notifications
                                        });
                                    });
                            }, function () {
                                res.render('creategroup', {
                                    errors: errors,
                                    user: user,
                                    events: req.user_events,
                                    groups: req.user_groups,
                                    notifications: req.notifications
                                });
                            });
                    }, function () {
                        res.render('creategroup', {
                            errors: errors,
                            user: user,
                            events: req.user_events,
                            groups: req.user_groups,
                            notifications: req.notifications
                        });
                    });
            }, function () {
                res.render('creategroup', {
                    errors: errors,
                    user: user,
                    events: req.user_events,
                    groups: req.user_groups,
                    notifications: req.notifications
                });
            });
    }
    //else display errors
    else{
        var groupname = req.body.groupname;
        res.render('creategroup', {
            errors:errors,
            user:user,
            groupname: groupname,
            groups: req.user_groups,
            events: req.user_events,
            notifications: req.notifications});
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

///REST FUNCTIONS

//Displays groups which the user is a member of.
function sendGroupPage(req, res, next){

    console.log(req.user_events);
    res.send({
        title: 'My groups',
        user            : req.session.user,
        groups          : req.user_groups,
        events          : req.user_events,
        invited_user_id : req.query.invited,
        notifications   : req.notifications
    });
}