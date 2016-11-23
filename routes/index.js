var express = require('express');
var pikkJson = require('../config/pikk.json');
var apiTools = require('../middleware/apiTools');
var validateTools = require('../middleware/validateTools');
var pikkTools= require('../middleware/pikkTools');
var authTools= require('../middleware/authTools');
var querystring = require('querystring');
var session = require('session');
var groupTools = require('../middleware/groupTools');
var eventTools = require('../middleware/eventTools');
var dbTools = require('../middleware/dbTools');
var passport = require('passport');
var app = require('express')();
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
    getIndex
);

function getIndex(req,res,next){
    res.render('index', { user: req.session.user,results: req.feed_result, groups: req.user_groups, events: req.user_events});
}

//------------ROUTING FOR SEARCH------------//
router.get('/search',
    authTools.isLoggedIn,
    apiTools.doSearch,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    getSearch
);

function getSearch(req,res,next){
    var user = req.session.user;
    res.render('resultlist',{ user:user, results: req.search_result, groups: req.user_groups, events: req.user_events});
}

//------------ROUTING FOR PLACE------------//
router.get('/place/:placeId',
    authTools.isLoggedIn,
    apiTools.showPlace,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    getPlace
);

function getPlace(req,res,next) {
    console.log('Here it is!!!!');
    var rating_string = (req.search_result[0].cluster_rating_mean).toString();
    var user = req.session.user;
    console.log(rating_string);
    console.log(typeof rating_string);
    res.render('place',{ user:user, rating_string: rating_string, place: req.search_result[0], groups: req.user_groups, events: req.user_events});
}

//------------ROUTING FOR HEADOUT------------//
//WIP
router.use('/headout',
    authTools.isLoggedIn,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    getHeadout
);

function getHeadout(req,res,next){
    var user = req.session.user;
    var key = process.env.AUTHKEY || '';
    res.render('headout', { user:user, title: 'Pikk', jaObject: req.search_result[0], groups: req.user_groups, events: req.user_events});
}

//------------ROUTING FOR START------------//
router.get('/start',
    authTools.isLoggedIn,
    pikkTools.createForm,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    getStart
);

function getStart(req,res,next){
    var user = req.session.user;
    res.render('start', {user: user, title: 'Pikk',form:req.form, groups: req.user_groups, events: req.user_events});
}

//------------ROUTING FOR MAP------------//
router.get('/map/*',
    authTools.isLoggedIn,
    groupTools.getGroupsByUser,
    eventTools.getEventsByUser,
    showMap
);

function showMap(req, res, next){
    var user = req.session.user;
    var q = querystring.stringify(req.query);
    q = querystring.unescape(q);
    var query = (querystring.parse(q));
    res.render('map', {user: user, query: query, groups: req.user_groups, events: req.user_events});
}

//------------ROUTING FOR LOGOUT------------//

router.get('/logout', function(req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});



module.exports = router;