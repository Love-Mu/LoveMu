const {validationResult} = require('express-validator');

const User = require('../models/User');

// Need to write validation functions to parse and validate user data
module.exports = {
  register: (req, res, next) => {
    // Create a User object here, ensuring that a User with the same email/username doesn't currently exist
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    //check if exists already
    if(db.getCollection('user').find({'email' : req.email }).count() > 0){
      res.json({
        success: false,
        message: 'Email already part of account',
      });
    }
    else if(db.getCollection('user').find({'user_name' : req.user_name }).count() > 0){
      res.json({
        success: false,
        message: 'Username in use',
      });
    }
    else{
      db.getCollection('user').save({email:req.email});
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