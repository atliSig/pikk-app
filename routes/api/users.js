'use strict';

var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../../middleware/dbTools');
var authTools = require('../../middleware/authTools');

//Load user model
var User = db.User;
var Group = db.Group;
var Event = db.Event;

router.get('/:userid',
    // authTools.isLoggedIn,
    get_user_profile);
router.get('/',
    // authTools.isLoggedIn,
    get_own_page);

//------HANDLERS-------//


function get_own_page(req, res, next){
    var user = req.session.user;
    res.redirect('/api/u/'+user.google.id);
}

function get_user_profile(req, res, next){
    var page_owner = req.params.userid;

    User.findOne({
        where:{
            'google.id': page_owner
        }
    })
        .then(function(owner){
            if(owner){
                res.send({
                    title           : owner.first_name,
                    owner           : owner,

                    user            : req.session.user,
                    groups          : req.user_groups,
                    events          : req.user_events,
                    notifications   : req.notifications
                });
            }
            else next();
        }, function(err){
            next();
        });
}
module.exports = router;