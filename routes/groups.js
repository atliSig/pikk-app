'use strict';

var express = require('express');
var router = express.Router();
var session = require('session');
var users = require('../lib/users');
var auth = require('../lib/auth');
var groups = require('../lib/groups');

module.exports = router;

router.get('/', auth.ensure_logged_in, displayGroupPage);
router.post('/creategroup', auth.ensure_logged_in, createGroup)




//\\\\\\\\\\functions//////////\\

function displayGroupPage(req, res, next){
    if(req.session)
        var user = req.session.user;
    else var user = JSON.parse(process.env.user);

    groups.getGroups(user.id, function(err, all){
        if(!err){
            if(all.length == 0)
                all = false
            res.render('grouplist', {
                title: 'My groups',
                user: user,
                groups: all
            });
        }
        else {
            console.log(err);
            res.redirect('/');
        }
    });
}

function createGroup(req, res, next){
    if(req.session)
        var user = req.session.user;
    else var user = JSON.parse(process.env.user);
    var members = req.body.members;
    var groupName = req.body.groupname;
    var description = req.body.description;
    console.log(req.url);
    groups.createGroup(user, members, groupName, description, function(err, all){
        res.render('groups');
    });
}
