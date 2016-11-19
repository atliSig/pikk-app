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
    var q = '';
    userData.forEach(function(tag){
        if(tag.length!==0){
            console.log('yo');
            q+='tag:'+encodeURIComponent(tag)+'+OR+';
        }
    });
    //Used to cut off last "+OR+"
    q = q.substring(0,q.length-4);
    apiConnector(q,req,res,next);
};

//Filter results by keywords
function filterByKeywords(results,keyword){
    var hasKeyword = [];
    results.forEach(function(item){
        var hasTheWord=false;
        item.keywords.forEach(function(word){
            if(word==keyword){
                hasTheWord = true;
            }
        });
        if(hasTheWord){
            hasKeyword.push(item);
        }
    });
    return hasKeyword;
}

//Filter results by rating
//Usage: req.search_result =  filterByRating(JSON.parse(str).yellow.items, 4);
function filterByRating(results, rating){
    var hasRating = [];
    results.forEach(function(item){
            if(item.rating_mean>rating) {
                hasRating.push(item);
            }else{
                console.log('whoops');
            }
    });
    return hasRating;
}

function filterByDistance(results, selection, max){
    var isClose = [];
    results.forEach(function(item){
        //dist is in meters
        var dist = geolib.getDistance(
            {latitude:item.coordinates.lat, longitude:item.coordinates.lon},
            {latitude:selection.location.latitude, longitude: selection.location.latitude}
        );
        console.log('dist in meters: '+ dist);
    })
}


