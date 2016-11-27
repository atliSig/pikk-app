/**
 * Created by atli on 5.11.2016.
 */

var geolib = require('geolib');

exports.findPlaces = function(req,res,next){
    //var data = req.pikkParam;
    //req.placeId ='macland';
    next();
};

exports.createForm = function(req,res,next){
    //This is an example of how we can create new
    //options to add to /start
    var form = [
        {
            title:'drasl',
            icon:'fa-bicycle',
            groupId:'groupId1',
            subGroupId:'subgroupId1',
            mainVals:[
                'hallo',
                'ballo',
                'kallo',
                'trallo'
            ],
            valIcons:[
                'fa-cutlery',
                'fa-bicycle',
                'fa-cutlery',
                'fa-cutlery'
            ],
            text:'this is a test text test text text'
        }
    ];
    req.form = form;
    next();
};

//Filters out results that are not considered to be a restaurant
exports.filterByNotWanted = function(req,res,next){
    req.badWords=['gasoline','gas','store'];
    var notWanted = req.badWords;
    var results=req.search_result;
    var isWanted = [];
    results.forEach(function(item){
        var wanted = true;
        item.keywords.forEach(function(keyword){
            notWanted.forEach(function(badTag){
                if(keyword==badTag){
                    wanted=false;
                }
            });
        });
        if(wanted){
            isWanted.push(item);
        }
    });
    req.search_result=isWanted;
    next();
};

//Filter results by keywords
//NEED TO CHANGE TO TAGS FOR SEMANTICS
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
        }
    });
    return hasRating;
}

exports.filterByDistance=function(req,res,next){
    var close_result=[];
    var results = req.search_result;
    var curr_loc= req.current_location;
    var max_dist= req.maximum_distance;
    var isClose = [];
    results.forEach(function(item){
        //dist is in meters
        if(item.has_coordinates) {
            var dist = geolib.getDistance(
                {latitude: item.coordinates.lat, longitude: item.coordinates.lon},
                {latitude: curr_loc.latitude, longitude: curr_loc.longitude}
            );
            if(dist<max_dist){
                close_result.push(item);
            }
        }

    });
    req.search_result=close_result;
    next();
};

exports.getIndexFeed=function(req,res,next){
    req.query=['burger','pizza','sushi'];
    req.feed_result = {};
    next();
};

