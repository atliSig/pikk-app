'use strict';
var session = require('session');

module.exports.ensure_logged_in = function ensure_logged_in(req, res, next){
  if(true || req.session.user){
      next();
  }
  else{
      res.redirect('/u/login');
  }
};

module.exports.redirect_if_logged_in = function redirect_if_logged_in (req, res, next) {
    if(session.user){
        res.redirect('/');
    }
    next();
};