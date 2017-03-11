/**
 * Created by atli on 16.11.2016.
 */
var GoogleStrategy= require('passport-google-oauth').OAuth2Strategy;

require('dotenv').config();


//Load models
var db = require('../middleware/dbTools');
var User = db.User;
//Load auth vars
var configAuth = require('./auth');

module.exports = function(passport){

    //Serialize user for session, we currently use
    //session.destroy though
    passport.serializeUser(function(user,done){
        console.log('Serializing user');
        done(null, user);
    });

    //Deserialize user for session
    // passport.deserializeUser(function(id,done){
    //     User.findOne({where: {'google.id':id}}).then(function(user){
    //         done(null,user);
    //     },function(err){done(err);});
    // });

    passport.deserializeUser(function(user, cb) {
        var google_user = user['google'];
        cb(null, user);
    });

    //Google Oauth2 strategy
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
                var img_url = profile.photos[0].value.replace('sz=50','sz=250');
                User.find({where: {'google.id': profile.id}}).then(
                    function (user) {
                        if (user) {
                            //If the user exists, log in
                            done(null, user);
                        } else {
                            //Else we create a new user
                            var email = profile.emails[0].value;
                            User.create({
                                'google.id': profile.id,
                                'google.token': token,
                                'google.displayName': profile.displayName,
                                'google.email': email,
                                'first_name': profile.name.givenName,
                                'last_name': profile.name.familyName,
                                'email': email,
                                'img_url': img_url
                            }).then(function(newUser){
                                done(null, newUser)
                            });
                        }
                    },
                    function (err) {
                        console.log(err);
                        done(err);
                    }
                );
            });
    }));
};