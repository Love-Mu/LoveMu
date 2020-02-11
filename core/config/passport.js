const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const {validationResult} = require('express-validator');

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
}, function(req, email, pass, done) {
  // Search for a user here that matches email
  User.findOne({email: email}).exec((err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'Email not linked to account'});
    }
    if (!user.comparePassword(pass)) {
      return done(null, false, {message: 'Wrong Password'});
    }
    return done(null, user);
  });
}));
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: "http://danu7.it.nuigalway.ie:8632/auth/googleCallback",
  passReqToCallback: true,
}), function (req, accessToken, refreshToken, profile, done) {
    // Insert code to register google user (need to save access/refreshToken, need better way to store users, etc)
});