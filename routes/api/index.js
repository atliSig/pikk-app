var express = require('express');
var apiTools = require('../../middleware/apiTools');
var validateTools = require('../../middleware/validateTools');
var pikkTools = require('../../middleware/pikkTools');
var authTools = require('../../middleware/authTools');
var notificationTools = require('../../middleware/notificationTools');
var querystring = require('querystring');
var session = require('session');
var groupTools = require('../../middleware/groupTools');
var eventTools = require('../../middleware/eventTools');
var dbTools = require('../../middleware/dbTools');
var passport = require('passport');
var router = express.Router();
var groups = require('./groups');


//------------ROUTING FOR INDEX------------//
router.get('/',
    pikkTools.getIndexFeed,
    apiTools.firstFeedConnector,
    getIndex
);

router.post('/',
    authTools.isLoggedIn,
    notificationTools.deleteIfOwner
);

function getIndex(req, res, next) {
    // console.log(req.user);
    if (req.params.format) {

    }else{
        res.send({
            results: req.feed_result,
            // user: req.session.user,
            // groups: req.user_groups,
            // events: req.user_events,
            // notifications: req.notifications,
            isIndex:true
        });
    }
}

//------------ROUTING FOR SEARCH------------//
// router.get('/search',
//     // authTools.isLoggedIn,
//     groupTools.getGroupsByUser,
//     eventTools.getEventsByUser,
//     notificationTools.getNotificationsByUser,
//     apiTools.doSearch,
//     getSearch
// );

// function getSearch(req, res, next) {
//     res.render('resultlist', {
//         results: req.search_result,
//         user: req.session.user,
//         groups: req.user_groups,
//         events: req.user_events,
//         notifications: req.notifications
//     });
// }

//------------ROUTING FOR PLACE------------//
router.get('/place/:placeId',
    // authTools.isLoggedIn,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    // notificationTools.getNotificationsByUser,
    apiTools.showPlace,
    getPlace
);

function getPlace(req, res, next) {
    var rating_string = (req.search_result[0].cluster_rating_mean).toString();
    // var user = req.session.user;
    res.send({
        // user: user,
        rating_string: rating_string,
        place: req.search_result[0],
        // groups: req.user_groups,
        // events: req.user_events
    });

}

//------------ROUTING FOR MAP------------//
router.get('/map/*',
    // authTools.isLoggedIn,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    // notificationTools.getNotificationsByUser,
    showMap
);

function showMap(req, res, next) {
    var query = querystring.stringify(req.query);
    query = querystring.unescape(query);
    query = (querystring.parse(query));
    res.send({
        query: query,
        // user: req.session.user,
        // groups: req.user_groups,
        // events: req.user_events,
        // notifications: req.notifications
    });
}

//------------ROUTING FOR LOGOUT------------//
router.get('/logout', function (req, res) {
    req.logout();
    var home = req.headers.host;
    if(!home.startsWith('http://'))
        home = 'http://'+home;
    var logg =
        "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue="+home;

    req.session.destroy(function (err) {
        res.redirect(logg);
        // res.redirect('/');
    });
});

router.get('/tags',function(req,res){
    var tags = [
        {
            id: 1,
            tag1: 'kjúklingur',
            name: 'Chicken',
            tag2: 'chicken',
            desc: 'Chicken is amazing and healthy!',
            imgurl:  'drasl'
        },
        {
            id: 2,
            tag1: 'steik',
            name: 'Steak',
            tag2: 'beef',
            desc: 'Where\'s the beef?',
            imgurl: 'drasl'
        },
        {
            id: 3,
            tag1: 'pítsa',
            name: 'Pizza',
            tag2: 'pizza',
            desc: 'No one can say no to a pizza?',
            imgurl: 'drasl'
        },
        {
            id: 4,
            tag1: 'hamborgari',
            name: "Hamburger",
            tag2: 'burger',
            desc: 'A hamburger is a good foody?',
            imgurl: 'drasl'
        },
        {
            id: 5,
            tag1: 'sjávarréttir',
            name: 'Seafood',
            tag2: 'seafood',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 6,
            tag1: 'sushi',
            name: 'Sushi',
            tag2: 'healthy',
            desc: '123',
            imgurl: 'drasl'
        },
        {
            id: 7,
            tag1: 'salat',
            name: 'Salat',
            tag2: 'healthy',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 7,
            tag1: 'arabískt',
            name: 'Kebab',
            tag2: 'kebab',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 8,
            tag1: 'tælenskt',
            name: 'Thai',
            tag2: 'thai',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 9,
            tag1: 'asískt',
            name: 'Asian',
            tag2: 'asian',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 10,
            tag1: 'indverskt',
            name: 'Indian',
            tag2: 'indian',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 11,
            tag1: 'mexikóskt',
            name: 'Mexican',
            tag2: 'mexican',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 12,
            tag1: 'tælenskt',
            name: 'Thai',
            tag2: 'thai',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 13,
            tag1: 'ítalskt',
            name: 'Italian',
            tag2: 'italian',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 14,
            tag1: 'íslenskt',
            name: 'Icelandic',
            tag2: 'icelandic',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 13,
            tag1: 'hádegismatur',
            name: 'Brunch',
            tag2: 'brunch',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 14,
            tag1: 'vegan',
            name: 'Vegan',
            tag2: 'healthy',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 15,
            tag1: 'hollt',
            name: 'Hollt',
            tag2: 'healthy',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 14,
            tag1: 'bakarí',
            name: 'Bakery',
            tag2: 'bakery',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 15,
            tag1: 'bístró',
            name: 'Bistro',
            tag2: 'bistro',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 16,
            tag1: 'kaffi',
            name: 'Coffee',
            tag2: 'juice',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        },
        {
            id: 17,
            tag1: 'áfengi',
            name: 'Alcohol',
            tag2: 'alcohol',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'drasl'
        }
    ];
    res.send({
        tags: tags
    });
});

module.exports = router;