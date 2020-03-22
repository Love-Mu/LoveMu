const passport = require('passport');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/User');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, pass, done) => {
  // Search for a user here that matches email
  User.findOne({email: email}).exec(async (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'Email not linked to account'});
    }
    const passwordMatch = await user.comparePassword(pass);
    if (!passwordMatch) {
      return done(null, false, {message: 'Wrong Password'});
    }
    return done(null, user);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
}, function async (jwtPayload, done) {
  User.findById({_id: jwtPayload.id}).exec((err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'User Not Associated With Account'});
    }
    return done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).exec((err, user) => {
    done(err, user);
  });
});