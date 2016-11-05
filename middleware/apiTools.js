/**
 * Created by atli on 21.10.2016.
 */
var https = require('https');
var url = require('url');


//FIXA THETTA DRASL SEM FYRST PLEASE
urlPrepper = function(theUrl,type){
    var query;
    if(type==1){
        query = encodeURI(theUrl.substr(7)); // 'search/'.length == 7
    }else if(type==2){
        query = encodeURI(theUrl);
    }else{
        query = encodeURI(url.parse(theUrl,true).query.query);
    }
    return "https://api.ja.is/search?q="+query+"&access_code="+process.env.SEARCH_KEY;
};

exports.showPlace = function(req,res,next){
    var str='';
    https.get(urlPrepper(req.url,1),function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            req.place_result = JSON.parse(str).yellow.items[0] // only one result;
            next();
        })
    });
};

exports.callAPI = function(req,res,next){
    var str='';
    https.get(urlPrepper(req.url,0),function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            req.search_result = JSON.parse(str).yellow.items;
            next();
        });
    });
};

exports.pikkCall = function(req,res,next){
    var str='';
    https.get(urlPrepper(req.bestFit,2),function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            req.pikk_result = JSON.parse(str).yellow.items;
            next();
        });
    });
}