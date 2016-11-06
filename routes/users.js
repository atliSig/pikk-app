'use strict';

var express = require('express');
var router = express.Router();
var session = require('session');
var users = require('../lib/users');
var auth = require('../lib/auth');


router.get('/signup', redirect_if_logged_in, function(req, res, next) {
    res.render('signup', {title: 'Sign up on Pikk'});
});

router.post('/signup', handle_signup, function(req, res, next) {
    users.finduser(function(err, all) {
        res.render('signup', {
            users: all
        });
    });
});

router.get('/:username', auth.ensure_logged_in, get_user_profile);


//------HANDLERS-------//
function get_user_profile(req, res, next){
    var page_owner = req.params.username;
    users.finduser(page_owner, function(err, all){
        if(!err || all.length != 0) {
            var owner = all[0]
            res.render('userprofile', {
                title: page_owner + "'s profile",
                owner: owner
            });
        }
        else res.error("There was an error. User \""+page_owner+"\" was not found" );
    })
}

function handle_signup(req, res, next){
    var username = req.body.username;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    users.createuser(username, first_name, last_name, function(err, status){
        var success = true;
        if(err || !status){
            success = false;
        }
        if(!success){
            res.render('signup',{
                error: err
            });
        }
    });
    next();
}

function redirect_if_logged_in(req, res, next){
    if(session.user){
        res.redirect('/');
    }
    next();
}

module.exports = router;