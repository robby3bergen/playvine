'use strict';
const sessionMiddleware = {};

sessionMiddleware.userIsLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

module.exports = sessionMiddleware;
