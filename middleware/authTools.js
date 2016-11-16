/**
 * Created by atli on 16.11.2016.
 */
exports.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    res.redirect('/');
};