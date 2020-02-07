const {validationResult} = require('express-validator');

const User = require('../models/User');

// Need to write validation functions to parse and validate user data
module.exports = {
  register: (req, res, next) => {
    // Create a User object here, ensuring that a User with the same email/username doesn't currently exist
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
        req.login(usr, (err) => {
          if (err) {
            return res.json(err);
          }
          return res.send({message: "Successful Login!"});
        });
      });
    });
  },
};