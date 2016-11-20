'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../middleware/dbTools');
//Load user model
// var user = require('../lib/users');
var User = db.User;

router.get('/:username', get_user_profile);
router.get('/', get_own_page);


//------HANDLERS-------//

function get_own_page(req, res, next){
    var user = req.session.user;
    res.redirect('/u/'+user.username);
}

function get_user_profile(req, res, next){
    var page_owner = req.params.username;
    var user = req.session.user;
    User.findOne({where:{username:page_owner}}).then(function(owner){
        if(owner){
            console.log(owner);
            res.render('userprofile', {title: user.first_name, user:user, owner:owner});

        }
        else next();
    }, function(err){
        if(err){
            next(err);
        }
    });
}

module.exports = router;