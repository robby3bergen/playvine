'use strict'
const express = require('express')
const router = express.Router()
const MusicSession = require('../models/musicSession')

/* GET create session page */
router.get('/create', (req, res, next) => {
  res.render('sessions/create', { title: 'Playvine | Create a session ' })
})

router.post('/', (req, res, next) => {
  // create a new session, then make a for loop to
  // iterate through the roles chosen in the form
  // and add them to the instrument key
  console.log(req.body.roles)
  const newSessionData = new MusicSession({
    name: req.body.name,
    startTime: req.body.startTime,
    location: req.body.location,
    sessionInfo: req.body.sessionInfo
  })
  for (let i = 0; i < req.body.roles.length; i++) {
    newSessionData.roles[i] = {
      instrument: req.body.roles[i]
    }
  }
  console.log(newSessionData)
  MusicSession.create(newSessionData)
    .then(result => {
      console.log(result)
      res.redirect('/sessions')
      /* redirect the user to the same route you used for
      the action= field in the hbs form */
    })
    .catch(next)
})

/* GET session list page */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    return res.render('sessions', { title: 'Playvine | Sessions' })
  }
  return res.redirect('/')
})

module.exports = router
