'use strict';

// packages
const express = require('express');
const router = express.Router();
const moment = require('moment');

// javascript files
const MusicSession = require('../models/musicSession');
const sessionMiddleware = require('../middleware/sessionMiddleware.js');

/* GET session list page */
router.get('/', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  if (req.session.currentUser) {
    MusicSession.find({}).sort({ location: 1, startTime: 1 })
      .then((musicSessions) => {
        musicSessions.forEach(session => {
          session.formattedStartTime = moment(session.startTime).format('DD MMMM YYYY — HH:mm');
        });
        return res.render('sessions/sessions-list', { title: 'Playvine | Sessions', musicSessions });
      })
      .catch(next);
  } else {
    return res.redirect('/');
  }
});

/* GET create session page */
router.get('/create', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  const enteredData = req.flash('FormData');
  const data = {
    messages: req.flash('message'),
    title: 'Playvine | Create a session',
    choiceData: enteredData
  };
  res.render('sessions/create', data);
});

/* GET modify session page */
router.get('/:id', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  // check if user is the creator of this session
  //

  console.log('parameters: ' + req.params.id);
  MusicSession.findById(req.params.id)
    .then(session => {
      const data = {
        title: 'Playvine | Modify your session',
        name: session.name,
        startTime: session.startTime,
        location: session.location,
        roles: session.roles,
        sessionInfo: session.sessionInfo
      };
      console.log('data: ' + data.name);
      res.render('sessions/create', data);
    })
    .catch(next);
});

router.post('/', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  /* define the instruments key as an array, so that it can take in a single choice
  passed by roles in the body of the request (a single choice is just a string) */
  let instruments = req.body.roles;
  if (typeof instruments === 'string') {
    instruments = [instruments];
  }
  // require user instrument choice
  if (!instruments) {
    req.flash('message', 'Choose at least one instrument');
    return res.redirect('/sessions/create');
  }
  // create a new session, then make a for loop to
  // iterate through the roles chosen in the form
  // and add them to the instrument key
  const newSessionData = new MusicSession({
    name: req.body.name,
    startTime: req.body.startTime,
    location: req.body.location,
    sessionInfo: req.body.sessionInfo,
    instruments
  });
  for (let i = 0; i < instruments.length; i++) {
    newSessionData.roles[i] = {
      instrument: instruments[i]
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

/* GET session details page */
router.get('/:id/detail', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  const id = req.params.id;
  MusicSession.findById(id)
    .then((session) => {
      session.formattedStartTime = moment(session.startTime).format('DD MMMM YYYY — HH:mm');
      console.log(session);
      res.render('sessions/detail', { musicSession: session, title: 'Playvine | Session details' });
    })
    .catch(next);
});

module.exports = router;
