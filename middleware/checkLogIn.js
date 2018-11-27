'use strict';
const checkLogIn = {};
checkLogIn.isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/sessions');
  }
  next();
};

module.exports = checkLogIn;
