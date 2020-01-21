const User = require('../models/User');

// Need to write validation functions to parse and validate user data

module.exports = {
  register: (req, res, next) => {
    // Create a User here

    passport.authenticate('local-signup', {
      successRedirect: '/spotify/reqAccess',
      failureRedirect: '',
    })
  },
  login: (req, res, next) => {
    // Find User based on email and use comparePassword method
    passport.authenticate('local-login', {
      successRedirect: '/profile/',
      failureRedirect: '',
    })
  },

  logout: (req, res, next) => {
    // Log user out

  }
};