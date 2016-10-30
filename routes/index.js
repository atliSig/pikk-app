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
    res.render('resultlist',{results: req.search_result});
}

router.get('/place',function(req,res,next) {
  res.render('place', {title: 'And now I am here :O'});
});

router.get('/headout', function(req, res, next) {
  var pikk = pikkJson.yellow.items[0];
  var key = process.env.AUTHKEY || '';
  res.render('headout', {title: 'Le Pikk', jaObject: pikk});
});

module.exports = router;