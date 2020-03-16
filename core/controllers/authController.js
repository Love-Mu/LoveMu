const {validationResult} = require('express-validator');
const request = require('request');

const spotifyController = require('./spotifyController');

const User = require('../models/User');

// Need to write validation functions to parse and validate user data
module.exports = {
  register: (req, res, next) => {
    // Create a User object here, ensuring that a User with the same email/username doesn't currently exist
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json(errors);
    }
    User.findOne({'$or':[{'email' : req.body.email },{'user_name' : req.body.user_name}]}).exec((err, user) => {
      if (err) {
        return res.status(404).json(err);
      }
      if (user) {
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
      if (req.body.sexuality == 'E') {
        usr.sexuality = ['M', 'F', 'O']
      } else {
        usr.sexuality = [req.body.sexuality];
      }
      usr.bio = req.body.bio;
      console.log(req.body.sexuality);
      usr.save((err) => {
        if (err) {
          return res.status(404).json(err);
        }
        req.login(usr, (err) => {
          if (err) {
            return res.status(404).json(err);
          }
          return res.status(200).json({message: "Successfully Registered!", user: usr.id});
          })
        });
      });
    },
  };
