var express = require('express');
var router = express.Router();
var pikkJson = require('../config/pikk.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Search is made
router.post('/search',function(req,res,next){
  var String = encodeURIComponent(req.body.query);
  res.render('resultlist',{title:'now I am here'});
});

router.get('/place',function(req,res,next) {
  res.render('place', {title: 'And now I am here :O'});
});


router.get('/headout', function(req, res, next) {
  var pikk = pikkJson.yellow.items[0];
  var key = process.env.AUTHKEY || '';
  res.render('headout', {title: 'Le Pikk', jaObject: pikk});

});

module.exports = router;