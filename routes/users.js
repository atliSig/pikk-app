'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../middleware/dbTools');
var authTools = require('../middleware/authTools');

//Load user model
var User = db.User;
var Group = db.Group;

router.get('/:userid', authTools.isLoggedIn, get_user_profile);
router.get('/', authTools.isLoggedIn, get_own_page);

//------HANDLERS-------//


function get_own_page(req, res, next){
    var user = req.session.user;
    res.redirect('/u/'+user.google.id);
}

function get_user_profile(req, res, next){
    var page_owner = req.params.userid;
    var user = req.session.user;
    User.findOne({
        where:{'google.id': page_owner},
        include:[{model: Group, as:'group'}]
    })
        .then(function(owner){
        if(owner){
            res.render('userprofile', {
                title: user.first_name,
                user: user,
                owner:owner,
                groups: owner.group});
        }
        else next();
    }, function(err){
        if(err){
            next(err);
        }
    });
}

module.exports = router;