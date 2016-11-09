'use strict';

var express = require('express');
var router = express.Router();
var session = require('session');
var users = require('../lib/users');
var auth = require('../lib/auth');
var groups = require('../lib/groups');

module.exports = router;

router.get('/', auth.ensure_logged_in, display_group_page);




//\\\\\\\\\\functions//////////\\

function display_group_page(req, res, next){
    if(req.session)
        var user = req.session.user;
    else var user = JSON.parse(process.env.user);
    console.log(user);
    groups.get_groups(user.id, function(err, all){
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
