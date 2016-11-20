/**
 * Created by atli on 21.10.2016.
 */
var https = require('https');
var url = require('url');

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

//This is used for the main pikk.
//Takes keywords from user and builds a query for them
exports.queryByTags = function(req, res, next){
    /*var types = [
        //Category 1
        ['kjúklingur','chicken'],
        ['steik','fillet','nautakjöt','kjöt','lambakjöt','beef','lamb'],
        ['sjávarréttir','fiskur','sea food','fish', 'seafood'],
        ['pítsa','flatbaka','pizza'],
        ['hamborgari','burger','fries'],
        ['sushi','healthy'],
        ['salat','healthy'],
        ['kebab','arabískt','arabian'],
        //Category 2
        ['tælenskt','thai'],
        ['asískt','núðlur','asian','noodles'],
        ['indverskt','indian','asian'],
        ['mexíkóskt','burrito','tortilla','nachos','mexican'],
        ['ítalskt','pasta','italian'],
        ['íslenskt','icelandic'],
        //Category 3
        ['hádegismatur','breakfast','brunch'],
        ['vegan', 'vegeterian','healthy'],
        ['hollt','salat','healthy'],
        ['bakarí','safi','bakery'],
        ['bístró','bistro'],
        ['kaffi', 'te','safi','coffee','tee','tea','juice'],
        ['áfengi','bjór','vín','kokteill','alcohol','beer','wine','coctail']
    ];*/
    var types = [
        //Category 1
        ['kjúklingur','chicken'],
        ['steik','beef'],
        ['sjávarréttir','seafood'],
        ['pítsa','pizza'],
        ['hamborgari','burger'],
        ['sushi','healthy'],
        ['salat','healthy'],
        ['kebab','arabískt'],
        //Category 2
        ['tælenskt','thai'],
        ['asískt','asian'],
        ['indverskt','indian'],
        ['mexíkóskt','mexican'],
        ['ítalskt','italian'],
        ['íslenskt','icelandic'],
        //Category 3
        ['hádegismatur','brunch'],
        ['vegan','healthy'],
        ['hollt','healthy'],
        ['bakarí','bakery'],
        ['bístró','bistro'],
        ['kaffi','juice'],
        ['áfengi','alcohol']
    ];


    //userData contains index into the array types
    var userInput = JSON.parse(req.body.userinput);
    var userData  = userInput.selection;
    req.current_location = userInput.location;
    console.log(req.current_location);
    //Testing distance
    req.maximum_distance = 10000;
    //We build a query on the form
    //((tag1 or tag2) or (tag3 or tag4) or...)AND(tag: veitingastadur)
    var q = '('
    //The query is (tag:param1+OR+tag:param2+OR+tag:param3)+AND+(tag:veitingastadur)
    userData.forEach(function(index){
        q+=buildQueryByTagArray(types[index]);
    });
    q.substring(0,q.length-4);
    q+=')+AND+(tag:'+encodeURIComponent('veitingastaður')+')';
    apiConnector(q,req,res,next);
};

//Returns a query part on the form:
//tag_1+OR+tag_2+...+tag_n+OR+
function buildQueryByTagArray(arr){
    var q ='';
    arr.forEach(function(tag){
        q+=encodeURIComponent(tag)+'+OR+';
    });
    return q;
}


