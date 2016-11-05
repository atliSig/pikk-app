var express = require('express');
var router = express.Router();
var pikkJson = require('../config/pikk.json');
var apiTools = require('../middleware/apiTools');
var validateTools = require('../middleware/validateTools');
var pikkTools= require('../middleware/pikkTools');
var querystring = require('querystring');

//------------ROUTING FOR INDEX------------//
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//------------ROUTING FOR SEARCH------------//
router.get('/search', apiTools.callAPI, getSearch);

function getSearch(req,res,next){
    console.log(req.search_result);
    res.render('resultlist',{results: req.search_result});
}

//------------ROUTING FOR PLACE------------//
function getPlace(req,res,next) {
  res.render('place',{place: req.place_result});
}

router.get('/place/*', apiTools.showPlace, getPlace);


//------------ROUTING FOR HEADOUT------------//
router.use('/headout', validateTools.pikkForm, pikkTools.findPlaces, apiTools.pikkCall ,getHeadout);

function getHeadout(req,res,next){
    var pikk = req.pikk_result[0];
    var key = process.env.AUTHKEY || '';
    res.render('headout', {title: 'Le Pikk', jaObject: pikk});
}


//------------ROUTING FOR START------------//
router.get('/start', function(req,res,next) {
    res.render('start', {title: 'Le Start'});
    });

//------------ROUTING FOR MAP------------//
router.get('/map/*', function (req, res, next){
  var q = querystring.stringify(req.query);
  q = querystring.unescape(q);
  var query = (querystring.parse(q));
  res.render('map', {query: query});
});

module.exports = router;