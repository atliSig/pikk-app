var express = require('express');
var apiTools = require('../middleware/apiTools');
var validateTools = require('../middleware/validateTools');
var pikkTools = require('../middleware/pikkTools');
var authTools = require('../middleware/authTools');
var notificationTools = require('../middleware/notificationTools');
var querystring = require('querystring');
var session = require('session');
var groupTools = require('../middleware/groupTools');
var eventTools = require('../middleware/eventTools');
var dbTools = require('../middleware/dbTools');
var passport = require('passport');
var router = express.Router();
var groups = require('./groups');

//------------ROUTING FOR INDEX------------//

router.get('/',
    pikkTools.getIndexFeed,
    apiTools.firstFeedConnector,
    apiTools.secondFeedConnector,
    apiTools.thirdFeedConnector,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    notificationTools.getNotificationsByUser,
    getIndex
);

router.post('/',
    authTools.isLoggedIn,
    notificationTools.deleteIfOwner
);

function getIndex(req, res, next) {

    res.render('index', {
        results: req.feed_result,
        user: req.session.user,
        groups: req.user_groups,
        events: req.user_events,
        notifications: req.notifications
    });
}

//------------ROUTING FOR SEARCH------------//
router.get('/search',
    // authTools.isLoggedIn,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    apiTools.doSearch,
    getSearch
);

function getSearch(req, res, next) {
    res.render('resultlist', {
        results: req.search_result,
        user: req.session.user,
        groups: req.user_groups,
        events: req.user_events,
        notifications: req.notifications
    });
}

//------------ROUTING FOR PLACE------------//
router.get('/place/:placeId',
    // authTools.isLoggedIn,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    apiTools.showPlace,
    getPlace
);

function getPlace(req, res, next) {
    var rating_string = (req.search_result[0].cluster_rating_mean).toString();
    var user = req.session.user;
    res.render('place', {
        user: user,
        rating_string: rating_string,
        place: req.search_result[0],
        groups: req.user_groups,
        events: req.user_events
    });

}

//------------ROUTING FOR HEADOUT------------//
//WIP
router.use('/headout',
    // authTools.isLoggedIn,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    getHeadout
);

function getHeadout(req, res, next) {
    var key = process.env.AUTHKEY || '';
    res.render('headout', {
        title: 'Pikk',
        jaObject: req.search_result[0],
        user: req.session.user,
        groups: req.user_groups,
        events: req.user_events,
        notifications: req.notifications
    });
}

//------------ROUTING FOR START------------//
router.get('/start',
    // authTools.isLoggedIn,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    pikkTools.createForm,
    getStart
);

function getStart(req, res, next) {
    res.render('start', {
        title: 'Pikk',
        form: req.form,

        user: req.session.user,
        groups: req.user_groups,
        events: req.user_events,
        notifications: req.notifications
    });
}

//------------ROUTING FOR MAP------------//
router.get('/map/*',
    // authTools.isLoggedIn,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    showMap
);

function showMap(req, res, next) {
    var query = querystring.stringify(req.query);
    query = querystring.unescape(query);
    query = (querystring.parse(query));
    res.render('map', {
        query: query,

        user: req.session.user,
        groups: req.user_groups,
        events: req.user_events,
        notifications: req.notifications
    });
}

//------------ROUTING FOR LOGOUT------------//

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

module.exports = router;