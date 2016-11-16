/**
 * Created by atli on 16.11.2016.
 */

module.exports = {
    'googleAuth': {
        'clientID': process.env.CLIENT_ID,
        'clientSecret': process.env.CLIENT_SECRET,
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    }
};