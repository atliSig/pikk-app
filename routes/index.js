var express = require('express');
var router = express.Router();
var pikkJson = require('../config/pikk.json');
var apiTools = require('../middleware/apiTools');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Search is made
router.get('/search',apiTools.callAPI,getSearch);

function getSearch(req,res,next){

    console.log(req.search_result);
    res.render('resultlist',{results: req.search_result});

}

function getPlace(req,res,next) {
  res.render('place',{place: req.place_result});
}

router.get('/place/*',apiTools.showPlace,getPlace);

router.get('/headout', function(req, res, next) {
  var pikk = pikkJson.yellow.items[0];
  var key = process.env.AUTHKEY || '';
  res.render('headout', {title: 'Le Pikk', jaObject: pikk});
});

router.get('/start', function(req,res,next){
   res.render('start',{title:'Le Start'});
});

module.exports = router;