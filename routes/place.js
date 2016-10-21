/**
 * Created by atli on 21.10.2016.
 */
var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next) {
    res.render('place', {title: 'And now I am here :O'});
});

module.exports = router;