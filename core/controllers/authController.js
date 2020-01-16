const User = require('../models/User');

// Need to write validation functions to parse and validate user data

module.exports = {
  register: (req, res, next) => {
    // Create a User object here, ensuring that a User with the same email/username doesn't currently exist


    const token = jwt.sign({id: user._id}, process.env.SECRET, {
      expiresIn: 86400,
    });
    res.status(200).send({auth: true, token: token});
  },
  login: (req, res, next) => {
    // Find User based on email and use comparePassword method
    const token = jwt.sign({id: user._id}, process.env.SECRET, {
      expiresIn: 86400,
    });
    res.status(200).send({auth: true, token: token});
  },

  logout: (req, res, next) => {
    if (req.user) {
    }
  },
};