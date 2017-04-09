'use strict';

/*
* This module handles all group related routes for the Android client.
* */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var groups = require('../../models/groups');
var db = require('../../middleware/dbTools');
var authTools = require('../../middleware/authTools');
var groupTools= require('../../middleware/groupTools');
var eventTools= require('../../middleware/eventTools');
var userTools = require('../../middleware/userTools');
var notificationTools = require('../../middleware/notificationTools');
var Group = db.Group;
var User = db.User;
var Event = db.Event;
var Notification = db.Notification;

router.get('/',
    displayGroupPage);

router.get('/:groupid',
    showGroupPage);

router.post('/creategroup',
    createGroup);

router.post('/:groupid/addMember',
    addMember,
    showGroupPage);

//------- Function handlers --------\\

/**
 * Adds a member to a specific group.
 * @param req
 * @param res
 * @param next
 */
function addMember(req, res, next){
    var addmember;
    if(req.body.email){
        addmember =  req.body.email;
    }
    else addmember = "-1";

    var user = req.session.user;

    //This is unsafe, as the malicious user can add him/herself to another group by changing the request parameter
    // to a groupid of interest.
    var groupid = req.params.groupid;
    var email = req.body.email;

    var errors = [];
    Group.findOne({
        where:{
            id:groupid
        }
    })
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
                                            res.send({'groupId':groupid});
                                        },
                                        function(){
                                            res.send({
                                                errors: errors
                                            });
                                        });

                            }, function (err) {
                                errors.push('Could not add a member');
                                res.send({
                                    errors: errors
                                });
                            });
                    }

                }, function(err){
                    errors.push('User not found');
                    req.errors = errors;
                    res.send({
                        errors: errors
                    });

                });
        }, function(err){
            errors.push(err);
            res.send( {
                errors: errors
            });
        });
}

/**
 * Shows the profile of a specific group
 * @param req
 * @param res
 * @param next
 */
function showGroupPage(req, res, next) {

    var user = req.session.user;
    var groupid = req.params.groupid;
    var inGroup = false;
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

                            req.session.currentGroup = group;
                            return res.send({
                                group: group,
                                members: members,
                                events: events
                            });
                        });
                }
                else{
                    return res.send("You are not in this group");
                }
            }
        );
}

/**
 * Displays all groups the user is a member of.
 * @param req
 * @param res
 * @param next
 */
function displayGroupPage(req, res, next){

    if(req.session.user){
        var user = req.session.user;

        User.getGroupsAndFriends(user.google.id,
            function(groupMembers)
            {
                res.send({groups:groupMembers});
            }, function(){ next();} );
    }
    else {
        next();
    }
}


/**
 * Creates a group with a name, description and members specified by the user.
 * @param req
 * @param res
 * @param next
 */
function createGroup(req, res, next){
    var user = req.session.user;
    var groupName = req.body.groupname;
    var members = req.body.members;
    var description = req.body.description;
    var membersToAdd = [];
    var errors = [];

    ///----Check for members in the form----////
    members.forEach(function(member){

        if (member.length > 0 && member !== user.email && member!=='[]'){
            membersToAdd.push(member);
        }
    });

    if(members.length === 0) {
        errors.push('Group must have at least one other member');
    }
    var c = 0;
    //Create group if no errors
    if(errors.length === 0) {
        //Create the group
        Group.create({
            name: groupName,
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
                                //find the users the admin wanted in the group
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
                                                        res.send({groupId: group.id});
                                                    });

                                            }, function () {
                                                res.send({
                                                    errors: errors
                                                });
                                            });
                                    },function () {
                                        res.send({
                                            errors: errors
                                        });
                                    });
                            }, function () {
                                res.send({
                                    errors: errors
                                });
                            });
                    }, function () {
                        res.send({
                            errors: errors
                        });
                    });
            }, function () {
                res.send({
                    errors: errors
                });
            });
    }
    //else send errors
    else{
        res.send({
            errors:errors,
            user:user,
            groupname: groupName
        });
    }
}

module.exports = router;