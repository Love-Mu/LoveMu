const {validationResult} = require('express-validator');

const User = require('../models/User');

// Need to write validation functions to parse and validate user data
module.exports = {
  register: (req, res, next) => {
    // Create a User object here, ensuring that a User with the same email/username doesn't currently exist
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors);
    }
    User.findOne({'email' : req.body.email }).exec((err, user) => {
      if (err) {
        return res.status(404).json(err);
      }
      if (user) {
        return res.status(409).json({message: 'Email already part of account'});
      }
      let usr = new User();
      usr.email = req.body.email;
      usr.password = usr.hashPassword(req.body.password);
      usr.save((err) => {
        if (err) {
          return res.status(404).json(err);
        }
        req.login(usr, (err) => {
          if (err) {
            return res.status(404).json(err);
          }
          return res.status(200).send({message: "Successful Login!"});
        });
      });
    });
  },
};