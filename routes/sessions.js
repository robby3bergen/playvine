'use strict'
const express = require('express')
const router = express.Router()
const _Session = require('../models/session')

/* GET create session page */
router.get('/create', (req, res, next) => {
  res.render('sessions/create', { title: 'Playvine | Create a session ' })
})

router.post('/create', (req, res, next) => {
  const { name, startTime, location, roles, sessionInfo } = req.body
  _Session.create({ name, startTime, location, roles, sessionInfo })
    .then(result => {
      console.log(result)
      res.redirect('/sessions/create')
      /* redirect the user to the same route you used for
      the action= field in the hbs form */
    })
    .catch(next)
})

module.exports = router
