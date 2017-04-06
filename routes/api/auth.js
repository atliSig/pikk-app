var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../../middleware/dbTools');
var User = db.User;
var authEnv = require('../../config/auth');
var GoogleAuth = require('google-auth-library');
var CLIENT_ID = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

var db = require('../../middleware/dbTools');
var authTools = require('../../middleware/authTools');

//Load user model
var User = db.User;


var auth = new GoogleAuth;
var client = new auth.OAuth2(CLIENT_ID, '', '');
router.use('/login',logInExistingUser, createNewUser);
function createNewUser(req, res, next){


    User.create({
        'google.id': req.googleId,
        'google.displayName': req.displayName,
        'google.email': req.email,
        'first_name': req.givenName,
        'last_name': req.familyName,
        'email': req.email,
        'img_url': req.img_url
    }).then(function(newUser){
        req.session.user = newUser;
        res.send({"member":newUser});
    });
}

function logInExistingUser(req, res, next) {
    var displayName = req.body.displayName;
    var givenName = req.body.givenName;
    var familyName = req.body.familyName;
    var email = req.body.email;
    var googleId = req.body.id;
    var img_url = req.body.img_url;


    req.displayName = displayName;
    req.givenName = givenName;
    req.familyName = familyName;
    req.email = email;
    req.googleId = googleId;
    req.img_url = img_url;
    User.findOne({
        where:{
            'google.id': googleId
        }
    })
        .then(function(member){
            if(member){
                req.session.user = member;
                res.send({
                    member: member
                });
            }
            else next();
        }, function(err){
            next();
        });

}
// bundle our routes
module.exports = router;


/*
 String displayName,
 String givenName,
 String familyName,
 String email,
 String id,
 Uri imgUrl,
* */