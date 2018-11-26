'use strict'
const checkFields = {}
checkFields.requireField = (req, res, next) => {
  const { username, password } = req.body
  if (!username) {
    req.flash('message', 'Username shouldn\'t be empty')
    return res.redirect(`/auth${req.path}`)
  }
  if (password.length < 8) {
    req.flash('message', 'Password should be at least 8 characters')
    req.flash('FormData', username)
    return res.redirect(`/auth${req.path}`)
  }
  next()
}

module.exports = checkFields
