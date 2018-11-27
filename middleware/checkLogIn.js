'use strict';

const checkLogin = {};
checkLogin.isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/sessions');
  }
  next();
};

module.exports = checkLogin;
