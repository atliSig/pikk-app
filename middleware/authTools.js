/**
 * Created by atli on 16.11.2016.
 */

//Checks if the current session has a logged in user
module.exports.isLoggedIn= function(req,res,next){
    if(req.session.user){
        next();
    }else{
        res.redirect('/');
    }
};