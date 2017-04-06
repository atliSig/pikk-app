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
    get_user);
// router.get('/',
//     // authTools.isLoggedIn,
//     get_user);

//------HANDLERS-------//

function get_user(req, res, next){
    var id = req.params.userid;
    User.findOne({
        where:{
            'id': id
        }
    })
        .then(function(member){
            if(member){
                res.send({
                    member: member
                });
            }
            else next();
        }, function(err){
            next();
        });
}

module.exports = router;