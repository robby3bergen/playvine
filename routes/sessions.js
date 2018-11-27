'use strict';
const express = require('express');
const router = express.Router();
const MusicSession = require('../models/musicSession');
const checkCurrentUser = require('../middleware/checkCurrentUser.js');

/* GET create session page */
router.get('/create', (req, res, next) => {
  // login validation
  res.render('sessions/create', { title: 'Playvine | Create a session ' });
});

router.post('/', (req, res, next) => {
  // login validation
  // create a new session, then make a for loop to
  // iterate through the roles chosen in the form
  // and add them to the instrument key
  const newSessionData = new MusicSession({
    name: req.body.name,
    startTime: req.body.startTime,
    location: req.body.location,
    sessionInfo: req.body.sessionInfo
  });
  for (let i = 0; i < req.body.roles.length; i++) {
    newSessionData.roles[i] = {
      instrument: req.body.roles[i]
    };
  }
  MusicSession.create(newSessionData)
    .then(result => {
      console.log(result);
      res.redirect('/sessions');
      /* redirect the user to the same route you used for
      the action= field in the hbs form */
    })
    .catch(next);
});

/* GET session list page */
router.get('/', checkCurrentUser.hasOpenSession, (req, res, next) => {
  res.render('sessions', { title: 'Playvine | Sessions' });
});

module.exports = router;
