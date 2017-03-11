/**
 * Created by Atli on 10.3.2017.
 */
/**
 * Created by atli on 16.11.2016.
 */

require('dotenv').config();
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
var configAuth = require('./auth');
opts.secretOrKey = configAuth.googleAuth.clientSecret;
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
//Load models
var db = require('../middleware/dbTools');
var User = db.User;

module.exports = function(passport) {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};