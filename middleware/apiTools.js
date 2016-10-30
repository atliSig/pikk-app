/**
 * Created by atli on 21.10.2016.
 */
var https = require('https');
var url = require('url');

urlPrepper = function(theUrl){
    var query = url.parse(theUrl,true).query.query; //wtf tho
    return "https://api.ja.is/search?q="+query+"&access_code="+process.env.SEARCH_KEY;
};

exports.callAPI = function(req,res,next){
    var str='';
    https.get(urlPrepper(req.url),function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            req.search_result = JSON.parse(str).yellow.items;
            next();
        })
    });
};