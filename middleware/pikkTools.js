/**
 * Created by atli on 5.11.2016.
 */


exports.findPlaces = function(req,res,next){
    req.bestFit = 'macland';
    next();
};