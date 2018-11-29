'use strict';
const sessionMiddleware = {};

sessionMiddleware.userIsLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

// sessionMiddleware.userIsCreator = (req, res, next) => {};

module.exports = sessionMiddleware;
