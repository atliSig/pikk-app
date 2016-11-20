/**
 * Created by atli on 21.10.2016.
 */
var https = require('https');
var url = require('url');
var geolib = require('geolib');

//The main function for a connection with the Ja API
apiConnector = function(query,req,res,next){
    //query=encodeURIComponent(query);
    //the query string for the Ja API
    var q = "https://api.ja.is/search?q="+query+"&access_code="+process.env.SEARCH_KEY;
    console.log(q);
    var str='';
    https.get(q,function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            var keyword='laptop';
            req.search_result = JSON.parse(str).yellow.items;
            console.log(req.search_result);
            next();
        });
    });
};

//The API call function for the simple search
exports.doSearch = function(req,res,next){
    apiConnector(encodeURIComponent(req.query.query),req,res,next);
};

//The API call method for showing endpoints for specific places
exports.showPlace = function(req,res,next){
    apiConnector('nameid:'+encodeURIComponent(req.params.placeId),req,res,next);
};

//Takes keywords from user and builds a query for them
exports.queryByTags = function(req, res, next){
    //var userData = JSON.parse(req.body.pikkParam);
    var userData = [req.query['first'],req.query['second'],req.query['third']];
    console.log(userData);
    var q = '('+encodeURIComponent(userData[0])+'+OR+';
    //The query is (tag:param1+OR+tag:param2+OR+tag:param3)+AND+(tag:veitingastadur)
    userData.forEach(function(tag){
        if(tag.length!==0){
            console.log('yo');
            q+='tag:'+encodeURIComponent(tag)+'+OR+';
        }
    });
    //Used to cut off last "+OR+"
    q = q.substring(0,q.length-4);
    q+=')+AND+(tag:'+encodeURIComponent('veitingastaður')+')';
    apiConnector(q,req,res,next);
};


