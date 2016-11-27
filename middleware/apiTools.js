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

//The API call function for the simple search
exports.doSearch = function(req,res,next){
    if(!req.query.query){
        next();
    } else {
        apiConnector('('+encodeURIComponent(req.query.query)+')+AND+(tag:' + encodeURIComponent('veitingastaður') + ')', req, res, next);
    }
};

// //The API call function for building the dynamic feed on the index
// exports.queryForFeed = function(req,res,next){
//     firstFeedConnector(,req,res,next);
// }

//The API call function for showing endpoints for specific places
exports.showPlace = function(req,res,next){
    apiConnector('nameid:'+encodeURIComponent(req.params.placeId),req,res,next);
};

//This is used for the main pikk.
//Takes keywords from user and builds a query for them
exports.queryByTags = function(req, res, next){
    if(!req.body.userinput){
        next();
    }
    else {
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
        var userInput = JSON.parse(req.body.userinput);
        var userData = userInput.selection;
        var q = '(';
        //The query is (tag:param1+OR+tag:param2+OR+tag:param3)+AND+(tag:veitingastadur)
        userData.forEach(function (index) {
            q += buildQueryByTagArray(types[index]);
        });
        q.substring(0, q.length - 4);
        q += ')+AND+(tag:' + encodeURIComponent('veitingastaður') + ')';
        apiConnector(q, req, res, next);
    }
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

exports.queryByIds =function(req,res,next){
    q='nameid:(';
    if(req.decidedMembers && req.decidedMembers.length >=1 ){
        var decidedMembers = req.decidedMembers;
        decidedMembers.forEach(function(member){
            q+=encodeURIComponent(member.selectedPlace)+'+OR+'
        });
        q+=')';
        apiConnector(q,req,res,next);
    }
    else{
        next();
    }

};

//The FeedConnector functions are kept in seperate functions
// since the query URL can only be so long

//Queries API for first keyword for index
exports.firstFeedConnector = function(req,res,next){
    //query=encodeURIComponent(query);
    //the query string for the Ja API
    var q = "https://api.ja.is/search?q="+encodeURIComponent(req.query[0])+')+AND+(tag:' + encodeURIComponent('veitingastaður') + ')'+"&access_code="+process.env.SEARCH_KEY;
    var str='';
    https.get(q,function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            req.feed_result.first = (JSON.parse(str).yellow.items);
            next();
        });
    });
};

//Queries API for second keyword for index
exports.secondFeedConnector = function(req,res,next){
    //query=encodeURIComponent(query);
    //the query string for the Ja API
    var q = "https://api.ja.is/search?q="+encodeURIComponent(req.query[1])+')+AND+(tag:' + encodeURIComponent('veitingastaður') + ')'+"&access_code="+process.env.SEARCH_KEY;
    var str='';
    https.get(q,function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            req.feed_result.second = (JSON.parse(str).yellow.items);
            next();
        });
    });
};

//Queries API for third keyword for index
exports.thirdFeedConnector = function(req,res,next){
    //query=encodeURIComponent(query);
    //the query string for the Ja API
    var q = "https://api.ja.is/search?q="+encodeURIComponent(req.query[2])+')+AND+(tag:' + encodeURIComponent('veitingastaður') + ')'+"&access_code="+process.env.SEARCH_KEY;
    var str='';
    https.get(q,function(response) {
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            req.feed_result.third = (JSON.parse(str).yellow.items);
            next();
        });
    });
};

//Chooses a random place from the selected list of places
//from the event.
exports.pickAPlace = function(req, res, next){
    var members = req.decidedMembers;
    var max = Math.floor(members.length);
    var index = Math.floor(Math.random() * max);
    //If req.isReady then all members have decided
    if(req.isReady){
        apiConnector(
            "nameid:"+
            encodeURI(members[index].dataValues.selectedPlace)
        );
    } else {
        next();
    }
};