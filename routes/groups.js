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

router.get('/', authTools.isLoggedIn, displayGroupPage);
router.get('/creategroup', authTools.isLoggedIn, showCreateGroup);
router.get('/:groupid', authTools.isLoggedIn, showGroupPage);
router.post('/creategroup', authTools.isLoggedIn, createGroup);
router.post('/:groupid/addMember', authTools.isLoggedIn, addMember);


//\\\\\\\\\\functions//////////\\
function addMember(req, res, next){
    var user = req.session.user;
    var groupid = req.params.groupid;
    var username = req.body.username;
    var errors = [];
    Group.findOne({where:{id:groupid}})
        .then(function(group){
            User.find({where:{
                username: username
            }})
                .then(function(member){
                    if(member && group)
                        group.addMember(member).then(function(){
                            res.redirect('/g/'+groupid);
                        });

                }, function(err){
                    errors.push(err);
                    res.render('groupprofile', {errors: errors, user: user});
                });
        }, function(err){
            errors.push(err);
            res.render('groupprofile', {errors: errors, user: user});
        });
}

//Shows the profile of a specific group
function showGroupPage(req, res, next) {
    var user = req.session.user;
    var groupid = req.params.groupid;

    // Get all group members in the specified group
    User.findAll({
        include:[{
            model: Group,
            as: 'group',
            where: {id: groupid},
            order: 'first_name'
        }]
    }).then(function(users){
        Group.findOne(
            {
                where: {
                    id:groupid
                }
            })
            .then(function(group){

                if(group && users) {
                    var in_group = false;
                    for(var i in users){

                        if(users[i].dataValues.username == user.username)
                        {
                            in_group = true;
                            break;
                        }
                    }
                    if(in_group) {
                        //grant access to members

                        group.getEvents()
                            .then(function(events){
                                res.render('groupprofile', {
                                    group: group,
                                    user: user,
                                    members: users,
                                    events: events
                                });
                            });
                    }
                    //Restrict access to outsiders

                    else{
                        res.redirect('/');
                    }
                }
                else{
                    next();
                }
            });
    });
}

//Displays groups which the user is a member of.
function displayGroupPage(req, res, next){
    var user = req.session.user;
    var last_letter = false;
    if(user.first_name.slice(-1)==='s')
    {
        last_letter=true;
    }
    Group
        .findAll()
        .then(function(groups) {
            res.render('grouplist',{
                title: 'My groups',
                user: user,
                groups: groups,
                last_letter: last_letter
            });
        });
}

//Rendering the creategroup view
function showCreateGroup(req, res, next){
    var user = req.session.user;
    res.render('creategroup', {title: 'Create Group', user:user});
}

//Create group handler
function createGroup(req, res, next){
    var user = req.session.user;
    var body = req.body;
    var errors = [];
    var members = [];

    ///----Check for members in the form----////
    for(var key in body){
        if(key !== 'groupname' && key !== 'description'){
            var member = body[key];
            if (member.length > 0 && member !== user.username){
                members.push(member);
            }
        }
    }

    if(!body.groupname || body.groupname.trim().length === 0){
        errors.push('Group must have non-empty name.');
    }
    var groupname = body.groupname;
    var description = body.description;

    if(members.length === 0) {
        errors.push('Group must have at least one other member');
    }

    //Create group if no errors
    if(errors.length === 0) {
        Group.create({
            name: groupname,
            description: description
        })
            .then(function (group) {
                User.findOne({
                    where: {username: user.username}
                })
                    .then(function (user) {
                        group.addMember(user, {isAdmin: true})
                            .then(function (newGroup) {
                                res.redirect('/g/' + group.id);
                            });
                    });
            });
    }
    //else display errors
    else{
        var groupname = req.body.groupname;
        res.render('creategroup', {errors:errors, groups:[], user:user, groupname: groupname});
    }
}