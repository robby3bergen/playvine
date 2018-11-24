'use strict';

const express = require('express');
const router = express.Router();

/* GET signup page. */
router.get('/', (req, res, next) => {
  res.render('signup', { title: 'Playvine - Sign Up' });
});

module.exports = router;
