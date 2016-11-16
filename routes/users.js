'use strict';

var express = require('express');
var router = express.Router();
var session = require('session');
var users = require('../lib/users');
var auth = require('../lib/auth');


router.get('/signup', auth.redirect_if_logged_in, function(req, res, next) {
    res.render('signup', {title: 'Sign up on Pikk'});
});

router.post('/signup', handle_signup, auth.ensure_logged_in);

router.get('/:username', auth.ensure_logged_in, get_user_profile);
router.get('/', auth.ensure_logged_in, get_own_page);


//------HANDLERS-------//

function get_own_page(req, res, next){
    if(session.user)
        var user = session.user;
    else var user = JSON.parse(process.env.user);
    res.redirect('u/'+user.username);
}

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

module.exports = router;