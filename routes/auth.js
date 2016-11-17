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
    successRedirect : '/login',
    failureRedirect : '/'
}));

function authenticate(req, res, next){


}

module.exports = router;
