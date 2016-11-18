/**
 * Created by atli on 16.11.2016.
 */
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy= require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL);

//Load user model
var user = require('../lib/users');
var User = user(sequelize, Sequelize);
//Load auth vars
var configAuth = require('./auth');

module.exports = function(passport){

    //Serialize user for session

    passport.serializeUser(function(user,done){
        console.log(user);
        try{
            user.then(done(null, user._boundto.dataValues.google.id))
        }
        catch(excepton){
            done(null, user)
        }
        //done(null, user[0].google.id);
    });

    //Deserialize user for session
    passport.deserializeUser(function(id,done){
        User.findOne({where: {'google.id':id}}).then(function(user){
            done(null,user);
        },function(err){return done(err);});
    });

    passport.use(new GoogleStrategy(
        {
            clientID     : configAuth.googleAuth.clientID,
            clientSecret : configAuth.googleAuth.clientSecret,
            callbackURL  : configAuth.googleAuth.callbackURL
        },
        function(token, refreshToken, profile, done) {

            //nextTick ensures we have all data from Google before
            //calling User.findOne
            process.nextTick(function () {
                User.find({'google.id': profile.id}).then(
                    function (user) {
                        if (user) {
                            //If the user exists, log in
                            console.log("user exists");
                            return done(null, user);
                        } else {
                            //Else we create a new user
                            var newUser = new User.findOrCreate({where: {
                                'google.id': profile.id,
                                'google.token': token,
                                'google.name': profile.displayName,
                                'google.email': profile.emails[0].value
                            }});
                            return done(null, newUser);
                        }
                    },
                    function (err) {
                        console.log(err);
                        return done(err);
                    }

                );
            });
        }));
};

