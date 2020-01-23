const {validationResult} = require('express-validator');
const passport = require('passport');
const User = require('../models/User');

// Need to write validation functions to parse and validate user data
module.exports = {
  register: (req, res, next) => {
    // Create a User object here, ensuring that a User with the same email/username doesn't currently exist
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({errors: errors.array()});
    }
    User.findOne({'email' : req.body.email }).exec((err, user) => {
      if (err) {
        return res.json(err);
      }
      if (user) {
        return res.json({message: 'Email already part of account'});
      }
      let usr = new User();
      usr.email = req.body.email;
      usr.password = usr.hashPassword(req.body.password);
      usr.save((err) => {
        if (err) {
          return res.json(err);
        }
        return res.json({message: 'Sucessfully Registered User'});
      });
    });
    //check if exists already
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