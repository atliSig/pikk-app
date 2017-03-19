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
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    // notificationTools.getNotificationsByUser,
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

module.exports = router;