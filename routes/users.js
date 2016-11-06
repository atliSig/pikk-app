'use strict';

var express = require('express');
var router = express.Router();
var session = require('session');

var users = require('../lib/users');

function redirect_if_logged_in(req, res, next){
    if(session.user){
        //res.redirect('index');
    }
    next();
}
router.get('/', redirect_if_logged_in, function(req, res, next) {
    res.render('signup', {title: 'Sign up on Pikk'});
});

router.post('/', handle_signup, function(req, res, next) {
    users.finduser(function(err, all) {
        res.render('signup', {
            users: all
        });
    });

});


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
    console.log(username);
    // users.finduser(function(err, all){
    //     console.log(all);
    // })
    next();
}

module.exports = router;