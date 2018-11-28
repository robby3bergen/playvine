'use strict';
const authMiddleware = {};

authMiddleware.userIsLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/sessions');
  }
  next();
};

authMiddleware.requireField = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    req.flash('message', 'Username shouldn\'t be empty');
    return res.redirect(`/auth${req.path}`);
  }
  if (password.length < 8) {
    req.flash('message', 'Password should be at least 8 characters');
    // 'FormData' stores data entered by user in the form
    // to prefill it when updating so progress isnt lost
    req.flash('FormData', username);
    return res.redirect(`/auth${req.path}`);
  }
  next();
};

authMiddleware.userHasOpenSession = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  next();
};

module.exports = authMiddleware;
