'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var groups = require('../lib/groups');
var db = require('../middleware/dbTools');
var Group = db.Group;
var authTools = require('../middleware/authTools');

module.exports = router;

router.get('/', authTools.isLoggedIn, displayGroupPage);
router.post('/creategroup', authTools.isLoggedIn, createGroup)


//\\\\\\\\\\functions//////////\\

function displayGroupPage(req, res, next){
    var user = req.session.user;
    console.log(user);
//user.google.id
    console.log(groups);
    Group.findAndCountAll().then(
        function(groups){
            console.log(groups);
            res.render('grouplist',{
                title: 'My groups',
                user: user,
                groups: groups
            });
        }
    );
    // groups.getGroups(5, function(err, all){
    //     if(!err){
    //         if(all.length == 0)
    //             all = false
    //         res.render('grouplist', {
    //             title: 'My groups',
    //             user: user,
    //             groups: all
    //         });
    //     }
    //     else {
    //         console.log(err);
    //         res.redirect('/');
    //     }
    // });
}

function createGroup(req, res, next){
    if(req.session)
        var user = req.session.user;
    else
        var user = JSON.parse(process.env.user);
    var body = req.body;
    var errors = [];
    var members = [];

    for(var key in body){
        if(key !== 'groupname' && key !== 'description'){
            var member = body[key];
            console.log(member.length)
            if (member.length > 0){
                members.push(member);
            }
        }
    }
    if(!body.groupname || body.groupname.trim().length === 0){
        errors.push('Group must have non-empty name.');
    }
    var groupname = body.groupname;
    var description = body.description;
    ///
    // members.remove('');
    if(members.length === 0) {
        errors.push('Group must have at least one other member');
    }

    if(errors.length === 0){
        Group.create({
            name: groupname,
            description: description
        }).then(function (groups) {
            console.log('Groups\n'+groups);
            res.render('grouplist',{groups:groups});
        });

    }
    else{
        res.render('grouplist',{errors: errors, groups:{ count: 1, rows: [{name: 'fartname', members: members}] }});
    }
    //groups.createGroup(user, members, groupName, description, function(err, all){
    //     res.render('grouplist',{groups:{ count: 1, rows: [{groupname: groupname, members: members}] }});
    //});
}
