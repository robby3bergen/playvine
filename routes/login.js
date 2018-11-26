'use strict'

const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

/* GET login page. */
router.get('/', (req, res, next) => {
  // check if user is already logged in before letting him in
  const data = {
    messages: req.flash('mongoError'),
    title: 'Playvine - Log in',
    username: req.query.username
  }
  res.render('login', data)
})

/* POST login */
router.post('/', (req, res, next) => {
  // check if user is already logged in again
  // check if passwords match
})

module.exports = router
