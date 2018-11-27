'use strict';

const express = require('express');
const router = express.Router();
const MusicSession = require('../models/musicSession');
const checkCurrentUser = require('../middleware/checkCurrentUser.js');

/* GET session list page */
router.get('/', (req, res, next) => {
  // create middleware for !req.session.currentUser
  if (req.session.currentUser) {
    MusicSession.find({}).sort({ location: 1, startTime: 1 })
      .then((musicSessions) => {
        // musicSessions.startTime = Moment(musicSessions.startTime).format('DD/MM/YYYY');
        console.log('musicSessions: ' + musicSessions);
        return res.render('sessions', { title: 'Playvine | Sessions', musicSessions });
      })
      .catch(next);
  } else {
    return res.redirect('/');
  }
});

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

module.exports = router;
