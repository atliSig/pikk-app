var express = require('express');
var router = express.Router();
var pikkJson = require('../config/pikk.json');
var apiTools = require('../middleware/apiTools');
var validateTools = require('../middleware/validateTools');
var pikkTools= require('../middleware/pikkTools');
var authTools= require('../middleware/authTools');
var querystring = require('querystring');
var session = require('session');
var users = require('../lib/users');
var dbTools = require('../middleware/dbTools');
var passport = require('passport');


//------------ROUTING FOR INDEX------------//
router.get('/', pikkTools.getIndexFeed, apiTools.queryForFeed,getIndex);

function getIndex(req,res,next){
    res.render('index', { user: req.session.user,results: req.search_result});
}

//------------ROUTING FOR SEARCH------------//
router.get('/search', authTools.isLoggedIn, apiTools.doSearch, getSearch);

function getSearch(req,res,next){
    var user = req.session.user;
    res.render('resultlist',{ user:user, results: req.search_result});
}

//------------ROUTING FOR PLACE------------//
router.get('/place/:placeId', authTools.isLoggedIn, apiTools.showPlace, getPlace);

function getPlace(req,res,next) {
    var user = req.session.user;
    res.render('place',{ user:user, place: req.search_result[0]});
}

//------------ROUTING FOR HEADOUT------------//
//WIP
router.use('/headout', authTools.isLoggedIn, getHeadout);

function getHeadout(req,res,next){
    var user = req.session.user;
    var key = process.env.AUTHKEY || '';
    res.render('headout', { user:user, title: 'Pikk', jaObject: req.search_result[0]});
}

//------------ROUTING FOR START------------//
router.get('/start', authTools.isLoggedIn, pikkTools.createForm, getStart);

function getStart(req,res,next){
    var user = req.session.user;
    res.render('start', {user: user, title: 'Pikk',form:req.form});
}

//----------ROUTING FOR CHOOSE------------//
router.post('/choose', authTools.isLoggedIn, apiTools.queryByTags, pikkTools.filterByDistance, getChoose);
function getChoose(req,res,next){
    var user = req.session.user;
    res.render('choose', { user:user, title:'Choose', results: req.search_result});
}

//------------ROUTING FOR MAP------------//
router.get('/map/*', authTools.isLoggedIn, showMap);

function showMap(req, res, next){
    var user = req.session.user;
    var q = querystring.stringify(req.query);
    q = querystring.unescape(q);
    var query = (querystring.parse(q));
    res.render('map', {user: user, query: query});
}

router.get('/logout', function(req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

module.exports = router;