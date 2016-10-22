/**
 * Created by atli on 21.10.2016.
 */
var express = require('express');
var router = express.Router();

//Search is made
router.post('/',function(req,res,next){
    var String = encodeURIComponent(req.body.query);
    res.render('resultlist',{title:'now I am here'});
});



module.exports = router;