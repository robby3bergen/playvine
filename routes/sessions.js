'use strict'

const express = require('express')
const router = express.Router()
const _Session = require('../models/session')

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    // const newSession = {
    //   name: 'Barcelona Artists',
    //   startTime: new Date(2019, 1, 19, 20, 15),
    //   location: 'Barcelona',
    //   roles: [{ instrument: 'Guitar' }, { instrument: 'Bass' }],
    //   sessionInfo: 'Live session with several artists from Barcelona'
    // }

    // _Session.create(newSession, (err, session) => {

    // })

    return res.render('sessions', { title: 'Playvine | Sessions' })
  }
  return res.redirect('/')
})

module.exports = router
