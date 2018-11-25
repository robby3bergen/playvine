'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

/* GET signup page. */
router.get('/', (req, res, next) => {
  res.render('signup', { title: 'Playvine - Sign Up' });
});

/* POST signup */
router.post('/', (req, res, next) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password
  };

  // first check if username already exists
  User.find({username: newUser.username})
    .then(() => {
      res.send('This username already exists.');
    })
    .catch((error) => {
      next(error);
    });

  // insert user to database
  User.create(newUser)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error.code);
      next(error);
  });
});

module.exports = router;
