'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../middleware/dbTools');
var authTools = require('../middleware/authTools');

//Load user model
var User = db.User;
var Group = db.Group;


router.get('/:username', authTools.isLoggedIn, get_user_profile);
router.get('/', authTools.isLoggedIn, get_own_page);
router.get('/settings', authTools.isLoggedIn, getSettings);
router.post('/settings', authTools.isLoggedIn, saveNewSettings);

//------HANDLERS-------//
function getSettings(req, res, next){
    var user = req.session.user;

    res.render('usersettings', {user: user});
}

function saveNewSettings(req,res,next){
    var user = req.session.user;
    res.send('Implement me plz');
}


function get_own_page(req, res, next){
    var user = req.session.user;
    res.redirect('/u/'+user.username);
}

function get_user_profile(req, res, next){
    var page_owner = req.params.username;
    var user = req.session.user;
    User.findOne({
        where:{username:page_owner},
        include:[{model: Group, as:'group'}]
    })
        .then(function(owner){
        if(owner){
            res.render('userprofile', {title: user.first_name, user:user, owner:owner, groups: owner.group});
        }
        else next();
    }, function(err){
        if(err){
            next(err);
        }
    });
}

module.exports = router;