const {validationResult} = require('express-validator');

const User = require('../models/User');

// Need to write validation functions to parse and validate user data
module.exports = {
  register: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    passport.authenticate('local-signup', {
      successRedirect: '/spotify/reqAccess',
      failureRedirect: '',
    });
  },
  login: (req, res, next) => {
    // Find User based on email and use comparePassword method
    passport.authenticate('local-login', {
      successRedirect: '/profile/',
      failureRedirect: '/auth/login',
    })
  },

  logout: (req, res, next) => {
    // Log user out

  }
};