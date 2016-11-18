/**
 * Created by atli on 21.10.2016.
 */
var https = require('https');
var url = require('url');

apiConnector = function(query,req,res,next){
    query=encodeURIComponent(query);
    //the query string for the Ja API
    var q = "https://api.ja.is/search?q="+query+"&access_code="+process.env.SEARCH_KEY;
    console.log(q);
    var str='';
    https.get(q,function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            req.search_result = JSON.parse(str).yellow.items;
            next();
        });
    });
};

exports.doSearch = function(req,res,next){
   apiConnector((req.query.query),req,res,next);
};

exports.showPlace = function(req,res,next){
    apiConnector('nameid:'+req.params.placeId,req,res,next);
};

//FIX LATER
exports.pikkCall = function(req,res,next){
    apiConnector(req.placeId,req,res,next);

};