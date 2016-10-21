/**
 * Created by atli on 21.10.2016.
 */
var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    res.render('resultlist',{title:'now I am here'});
});

module.exports = router;