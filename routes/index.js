var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search',function(req,res,next){
  res.render('resultlist',{title:'now I am here'});
});

router.get('/place',function(req,res,next){
  res.render('place',{title:'And now I am here :O'});
});

module.exports = router;
