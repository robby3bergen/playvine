'use strict';

const checkCurrentUser = {};
checkCurrentUser.hasOpenSession = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  next();
};

module.exports = checkCurrentUser;
