'use strict';

const express = require('express');
const router = express.Router();
const musicSession = require('../models/musicSession');

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    musicSession.find({})
      .then((musicSessions) => {
        console.log('musicSessions: ' + musicSessions);
        return res.render('sessions', { title: 'Playvine | Sessions' });
      })
      .catch(next);
  } else {
    return res.redirect('/');
  }
});

module.exports = router;
