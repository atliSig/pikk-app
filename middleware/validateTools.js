/**
 * Created by atli on 5.11.2016.
 */

exports.pikkForm = function(req,res,next){
    var data = JSON.parse(req.body.pikkParam);
    for(var key in data){
        if(data[key]<0||data[key]>6){
            res.redirect('/');
            console.log('stop hacking pikk!');
        }
    }
    next();
};