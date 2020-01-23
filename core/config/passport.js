const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

// https://scotch.io/tutorials/easy-node-authentication-setup-and-local#toc-handling-signupregistration

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // Find User with above id, return done(err, user)
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, function(email, pass, done) {
  // Search for a user here that matches email
  
  }
));