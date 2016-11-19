'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var groups = require('../lib/groups');
var db = require('../middleware/dbTools');
var Group = db.Group;

module.exports = router;

router.get('/', displayGroupPage);
router.post('/creategroup', createGroup)


//\\\\\\\\\\functions//////////\\

function displayGroupPage(req, res, next){
    if(req.session)
        var user = req.session.user;
    else var user = JSON.parse(process.env.user);
//user.google.id
    Group.findAndCountAll().then(
        function(groups){
            console.log(groups);
            res.render('grouplist',{
                title: 'My groups',
                user: user,
                groups: groups.rows
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
    var numberOfMembers = 0;
    for(var key in body){
        console.log('key: '+key +', '+typeof key);
        if(key !== 'groupname' && key !== 'description'){
            members.push(body[key]);
        }
    }
    if(!body.groupname || body.groupname.trim().length === 0){
        errors.push('Group must have non-empty name.');
    }
    ///
    // members.remove('');
    if(members.length === 0) {
        errors.push('Group must have at least one other member');
    }
    console.log(members);
    console.log('----------------');
    console.log(req.body);
    var groupName = req.body.groupname;
    var description = req.body.description;
    console.log(req.url);
    //groups.createGroup(user, members, groupName, description, function(err, all){
        res.render('grouplist',{groups:{ count: 1, rows: ['group'] }});
    //});
}
