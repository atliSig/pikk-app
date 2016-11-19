'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../middleware/dbTools');
//Load user model
// var user = require('../lib/users');
var User = db.User;


router.get('/signup', function(req, res, next) {
    res.render('signup', {title: 'Sign up on Pikk'});
});

router.post('/signup', handle_signup);

router.get('/:username', get_user_profile);
router.get('/', get_own_page);


//------HANDLERS-------//

function get_own_page(req, res, next){
    if(session.user)
        var user = session.user;
    else var user = JSON.parse(process.env.user);
    res.redirect('u/'+user.username);
}

function get_user_profile(req, res, next){
    var page_owner = req.params.username;
    User.findOne({where:{username:page_owner}}).then(function(user){
        if(user){
            console.log(user);
            res.render('userprofile', {title: user.first_name, user:req.user, owner:user});
        }
        else next();
    }, function(err){
        if(err){
            next(err);
        }
    });
}

function handle_signup(req, res, next){
    res.send('Deprecated. If you REALLY want to sign up, then STFU');
}

module.exports = router;