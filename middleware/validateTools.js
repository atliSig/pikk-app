/**
 * Created by atli on 5.11.2016.
 */


//This is not used currently
exports.pikkForm = function(req,res,next){
    //data contains pikk params from a single user
    var data;
    /*for(var key in data){
        if(data[key]<0||data[key]>6){
            res.redirect('/');
        }
    }*/
    req.pikkParam = data;
    next();
};