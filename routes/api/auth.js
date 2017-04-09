'use strict';
/*
* This module handles the authentication for the Android client.
* The methods used are not safe and should not be used in production.
* The reason we did this is that we had trouble using the Google authentication and integrity verification.
* */
var express = require('express');
var router = express.Router();

var db = require('../../middleware/dbTools');

//Load user model
var User = db.User;

router.use('/login', logInExistingUser, createNewUser);

//------- Functions Handlers --------\\

/**
 * Creates a new user if the requested user does not exist and logs her/him in.
 * @param req
 * @param res
 * @param next
 */
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

/**
 * Logs in the requested user by updating req.session.user.
 * @param req
 * @param res
 * @param next
 */
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
