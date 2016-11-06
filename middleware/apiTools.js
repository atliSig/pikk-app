/**
 * Created by atli on 21.10.2016.
 */
var https = require('https');
var url = require('url');

apiConnector = function(query,req,res,next){
    q = "https://api.ja.is/search?q="+query+"&access_code="+process.env.SEARCH_KEY;
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
   apiConnector(encodeURIComponent(req.query.query),req,res,next);
};

exports.showPlace = function(req,res,next){
    apiConnector('nameid:'+req.params.placeId,req,res,next);
};

//FIIX LATER
exports.pikkCall = function(req,res,next){
    var str='';
    https.get(urlPrepper(req.bestFit,2),function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            req.pikk_result = JSON.parse(str).yellow.items;
            console.log(req.pikk_result);
            next();
        });
    });
}