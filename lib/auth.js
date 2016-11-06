'use strict';

module.exports.ensure_logged_in = function ensure_logged_in(req, res, next){
  if(true || req.session.user){
      next();
  }
  else{
      res.redirect('/u/login');
  }
};