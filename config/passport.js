/**
 * Created by atli on 16.11.2016.
 */
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy= require('passport-google-oauth').OAuth2Strategy;

//Load user model
var User = require('../lib/users');

//Load auth vars
var configAuth = require('./auth');

module.exports = function(passport){

    //Serialize user for session
    passport.serializeUser(function(user,done){
        done(null, user.id);
    });

    //Deserialize user for session
    passport.deserializeUser(function(id,done){
        User.findById(id, function(err,user){
            done(err,user);
        });
    });

    passport.use(new GoogleStrategy(
        {
            clientID     : configAuth.googleAuth.clientID,
            clientSecret : configAuth.googleAuth.clientSecret,
            callbackURL  : configAuth.googleAuth.callbackURL
        },
        function(token, refreshToken, profile, done){

            //nextTick ensures we have all data from Google before
            //calling User.findOne
            process.nextTick(function(){
                User.findOne({'google.id': profile.id}, function(err, user){
                    if(err){
                        console.log('callback');
                        console.log(err);
                        return done(err);
                    }
                    if(user){
                        //If the user exists, log in
                        console.log("user exists");
                        return done(null, user);
                    } else{
                        //Else we create a new user
                        var newUser = new User();

                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value;
                        console.log("newUser");
                        newUser.save(function(err){
                            if(err){
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};

