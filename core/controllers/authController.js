const {validationResult} = require('express-validator');
const request = require('request');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const moment = require('moment');

const spotifyController = require('./spotifyController');
const User = require('../models/User');

// Need to write validation functions to parse and validate user data
exports.login = (req, res, next) => {
    passport.authenticate('local', {session: false }, (err, user) => {
      if (err || !user) {
        return res.status(403).json({message: 'Unsuccessful Login!'});
      }
      req.login(user, {session: false}, (err) => {
        if (err) {
          return res.status(403).json({message: 'Unsuccessful Login!'});
        }
        const token = jwt.sign({id: user.id}, process.env.SECRET);
        let id = user.id;
        return res.status(200).json({message: 'Successful Login!', token, id});
      });
    })(req, res);
  };
exports.register = (req, res, next) => {
  // Create a User object here, ensuring that a User with the same email/username doesn't currently exist
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json(errors);
  }
  User.findOne({'$or':[{'email' : req.body.email },{'user_name' : req.body.user_name}]}).exec((err, user) => {
    if (err) {
      return res.status(404).json(err);
    }
    if (user && user.complete === true) {
      if (user.email.toLowerCase() === req.body.email.toLowerCase()) {
        return res.status(409).json({message: 'Email already part of account'});  
      }
      if (user.user_name.toLowerCase() === req.body.user_name.toLowerCase()){
        return res.status(409).json({message: 'Username already part of account'})
      }
    }
    let usr = new User();
    usr.email = req.body.email;
    usr.password = usr.hashPassword(req.body.password);
    usr.user_name = req.body.user_name;
    usr.fname = req.body.fname;
    usr.sname = req.body.sname;
    usr.dob = req.body.dob;
    usr.location = req.body.location;
    usr.image = req.body.image;
    usr.gender = req.body.gender;
    usr.complete = true;
    if (req.body.sexuality == 'Everyone') {
      usr.sexuality = ['Male', 'Female', 'Rather Not Say', 'Other']
    } else {
      usr.sexuality = [req.body.sexuality];
    }
    usr.bio = req.body.bio;
    usr.save((err) => {
      req.login(usr, {session: false}, (err) => {
        if (err) {
          return res.status(403).json({message: 'Unsuccessful Login!'});
        }
        const token = jwt.sign({id: usr.id}, process.env.SECRET);
        let id = usr.id;
        return res.status(200).json({message: 'Successful Login!', token, id});
      });
    });
  })
};

exports.google = (req, res, next) => {
    const token = jwt.sign({id: req.user.id}, process.env.SECRET);
    const id = req.user.id;
    const verified = req.user.complete;
    return res.redirect(`https://lovemu.compsoc.ie?google_token=${token}&id=${id}&verified=${verified}`);  
}