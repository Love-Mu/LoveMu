const passport = require('passport');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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

passport.use(new GoogleStrategy({
  clientID: process.env.googleCLIENT,
  clientSecret: process.env.googleSECRET,
  callbackURL: 'https://lovemu.compsoc.ie/auth/google/callback',
  passReqToCallback: true
}, function async (req, accessToken, refreshToken, profile, done) {
  User.findOne({'email' : profile.emails[0].value }).exec((err, user) => {
    if (err) {
      return done(err);
    }
    if (user && user.complete) {
      return done(null, user);
    }
    else {
      const usr = new User({});
      usr.email = profile.emails[0].value;
      usr.fname = profile.name.givenName;
      usr.sname = profile.name.familyName;
      usr.image = profile.photos[0].value;
      usr.sexuality = ['Male', 'Female', 'Rather Not Say', 'Other'];
      usr.gender = 'Rather Not Say';
      usr.save(); 
      return done(null, usr);
    }
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
  passReqToCallback: true
}, function async (req, jwtPayload, done) {
  User.findOne({_id: jwtPayload.id}).exec((err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'User Not Associated With Account'});
    }
    if (!user.complete) {
      return done(null, false, {message: 'User Is Not Verified'});
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