'use strict'

const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

/* GET signup page. */
router.get('/', (req, res, next) => {
  const data = {
    messages: req.flash('mongoError'),
    title: 'Playvine - Sign Up',
    username: req.query.username
  }
  res.render('signup', data)
})

/* POST signup */
router.post('/', (req, res, next) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password
  }

  // password validation
  if (newUser.password.length < 8) {
    req.flash('mongoError', 'Password should be at least 8 characters')
    return res.redirect('/signup?username=' + encodeURIComponent(newUser.username))
  }

  // insert user to database
  User.create(newUser, (err, user) => {
    if (err) {
      if (err.code === 11000) {
        req.flash('mongoError', `Username '${newUser.username}' has already been taken.`)
      } else {
        throw err
      }
      return res.redirect('/signup?username=' + encodeURIComponent(newUser.username))
    } else {
      req.flash('userCreated', 'Your are ready to go!')
      return res.redirect('/')
    }
  })
})

module.exports = router
