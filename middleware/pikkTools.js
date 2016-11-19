/**
 * Created by atli on 5.11.2016.
 */


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
}

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

