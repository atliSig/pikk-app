/**
 * Created by Atli on 10.3.2017.
 */
'use strict';

// demo Route (GET http://localhost:8080)
// ...

// pass passport for configuration
var express = require('express');
var db = require('../middleware/dbTools');
var User = db.User;
var authEnv = require('../config/auth');
// bundle our routes
var apiRoutes = express.Router();



apiRoutes.use('/', function(req,res,next){
    var GoogleAuth = require('google-auth-library');
    var auth = new GoogleAuth;
    var client = new auth.OAuth2(authEnv.googleAuth.clientID, '', '');
    client.verifyIdToken(
        req.body.token,
        authEnv.googleAuth.clientID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(e, login) {
            var payload = login.getPayload();
            var userid = payload['sub'];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];
        });
});
