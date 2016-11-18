/**
 * Created by atli on 21.10.2016.
 */
var https = require('https');
var url = require('url');


//The main function for a connection with the Ja API
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
            var keyword='laptop';
            req.search_result = JSON.parse(str).yellow.items;
            //req.search_result = filterByKeywords(,keyword);
            next();
        });
    });
};


//The API call function for the simple search
exports.doSearch = function(req,res,next){
    apiConnector((req.query.query),req,res,next);
};

//The API call method for showing endpoints for specific places
exports.showPlace = function(req,res,next){
    apiConnector('nameid:'+req.params.placeId,req,res,next);
};

//FIX LATER
exports.pikkCall = function(req,res,next){
    apiConnector(req.placeId,req,res,next);
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



