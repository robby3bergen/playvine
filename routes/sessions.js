'use strict';

// packages
const express = require('express');
const router = express.Router();
const moment = require('moment');

// javascript files
const MusicSession = require('../models/musicSession');
const JoinRequest = require('../models/joinRequest');
const sessionMiddleware = require('../middleware/sessionMiddleware.js');

/* ---------------- session list page ---------------- */
// GET
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

/* ---------------- create session page ---------------- */
// GET
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
      session.formattedStartTime = moment(session.startTime).format('YYYY-MM-DDTHH:mm');
      const data = {
        title: 'Playvine | Modify your session',
        name: session.name,
        startTime: session.formattedStartTime,
        location: session.location,
        roles: session.roles,
        sessionInfo: session.sessionInfo
      };
      console.log('data: ' + data.name);
      res.render('sessions/create', data);
    })
    .catch(next);
});

/* POST create session */
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
    creatorId: req.session.currentUser._id,
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

/* ---------------- modify session page ---------------- */
// GET
router.get('/:id/edit', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  MusicSession.findById(req.params.id)
    .then((session) => {
      console.log('Current User id is ' + req.session.currentUser._id);
      /* MONGOOSE DOESN'T LET YOU COMPARE OBJECT IDS WITH AN ===
      OPERATOR, SO YOU NEED TO USE .equals() TO BE ABLE TO */
      if (session.creatorId.equals(req.session.currentUser._id)) {
        console.log('Creator id for the session is ' + session.creatorId);
        session.formattedStartTime = moment(session.startTime).format('YYYY-MM-DDTHH:mm');
        const data = {
          creatorId: session.creatorId,
          id: session._id,
          title: 'Playvine | Modify your session',
          name: session.name,
          startTime: session.formattedStartTime,
          location: session.location,
          roles: session.roles,
          sessionInfo: session.sessionInfo
        };
        console.log('data: ' + data.name);
        res.render('sessions/edit', data);
      } else {
        res.redirect('/sessions');
      }
    })
    .catch(next);
});

// POST
router.post('/:id/edit', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  const id = req.params.id;
  const { name, formattedStartTime, location, sessionInfo, instruments } = req.body;
  MusicSession.findByIdAndUpdate(id, { name, formattedStartTime, location, sessionInfo, instruments })
    .then(() => {
      res.redirect('/');
    })
    .catch(next);
});

/* ---------------- session details page ---------------- */
// GET
router.get('/:id', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  const id = req.params.id;
  MusicSession.findById(id)
    .then((session) => {
      session.formattedStartTime = moment(session.startTime).format('DD MMMM YYYY — HH:mm');
      res.render('sessions/detail', { musicSession: session, title: 'Playvine | Session details', messages: req.flash('message') });
    })
    .catch(next);
});

/* POST join session */
router.post('/:id/join', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  JoinRequest.create({ joinerId: req.session.currentUser._id, sessionId: req.params.id, role: req.body.role, status: 'Pending' })
    .then((session) => {
      req.flash('message', 'Your request has been sent. Please wait for the organiser to confirm or decline!');
      res.redirect(`/sessions/${req.params.id}/detail`);
    })
    .catch(next);
});

/* ---------------- delete session POST ---------------- */
router.post('/:id/delete', sessionMiddleware.userIsLoggedIn, (req, res, next) => {
  const id = req.params.id;
  MusicSession.findByIdAndRemove(id)
    .then(result => {
      res.redirect('/sessions');
    })
    .catch(next);
});

module.exports = router;
