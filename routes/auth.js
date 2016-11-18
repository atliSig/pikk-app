'use strict';
var express = require('express');
var router = express.Router();
var pikkJson = require('../config/pikk.json');
var apiTools = require('../middleware/apiTools');
var validateTools = require('../middleware/validateTools');
var pikkTools= require('../middleware/pikkTools');
var authTools= require('../middleware/authTools');
var querystring = require('querystring');
var session = require('session');
var users = require('../lib/users');
var dbTools = require('../middleware/dbTools');
var passport = require('passport');


//--------ROUTING FOR GOOGLE AUTH--------//
router.get('/google', passport.authenticate('google',{scope: ['profile','email']}));


router.get('/google/callback', passport.authenticate('google',{
    //just some route to see success
    session:true,
    failureRedirect : '/login'
}), function(req,res){
    console.log(req.user);
    req.session.user = req.user;
    res.redirect('/');
});

function authentiskate(req, res, next){
    passport.authenticate('google',{
        //just some route to see success
        successRedirect : '/login',
        failureRedirect : '/'
    });

    console.log('ende');
    next();
}

module.exports = router;
function authenticate(req, res, next) {
    // ask passport to authenticate
    passport.authenticate('google', function(err, user, info) {
        if (err) {
            // if error happens
            return next(err);
        }

        if (!user) {
            // if authentication fail, get the error message that we set
            // from previous (info.message) step, assign it into to
            // req.session and redirect to the login page again to display
            req.session.messages = info.message;
            return res.redirect('/login');
        }
        // if everything's OK
        req.logIn(user, function(err) {
            if (err) {
                req.session.messages = "Error";
                return next(err);
            }
            // set the message
            req.session.user = user;
            return res.redirect('/');
        });

    })(req, res, next);
}