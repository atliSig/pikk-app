var express = require('express');
var router = express.Router();
var pikkJson = require('../config/pikk.json');
var apiTools = require('../middleware/apiTools');
var validateTools = require('../middleware/validateTools');
var pikkTools= require('../middleware/pikkTools');
var querystring = require('querystring');
var session = require('session');
var users = require('../lib/users');


//------------ROUTING FOR INDEX------------//
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//------------ROUTING FOR SEARCH------------//
router.get('/search', apiTools.doSearch, getSearch);

function getSearch(req,res,next){
    res.render('resultlist',{results: req.search_result});
}

//------------ROUTING FOR PLACE------------//
router.get('/place/:placeId', apiTools.showPlace, getPlace);

function getPlace(req,res,next) {
    res.render('place',{place: req.search_result[0]});
}

//------------ROUTING FOR HEADOUT------------//
router.use('/headout', validateTools.pikkForm, pikkTools.findPlaces, apiTools.pikkCall, getHeadout);

function getHeadout(req,res,next){
    var key = process.env.AUTHKEY || '';
    res.render('headout', {title: 'Le Pikk', jaObject: req.search_result[0]});
}

//------------ROUTING FOR START------------//
router.get('/start',pikkTools.createForm,getStart);

function getStart(req,res,next){
    res.render('start', {title: 'Le Start',form:req.form});
}

//------------ROUTING FOR MAP------------//
router.get('/map/*', function (req, res, next){
  var q = querystring.stringify(req.query);
  q = querystring.unescape(q);
  var query = (querystring.parse(q));
  res.render('map', {query: query});
});

module.exports = router;