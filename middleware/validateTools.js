/**
 * Created by atli on 5.11.2016.
 */

exports.pikkForm = function(req,res,next){
    var data = JSON.parse(req.body.pikkParam);
    next();
};