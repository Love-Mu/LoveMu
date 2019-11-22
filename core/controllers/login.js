const crypto = require('crypto');
const User = require('../models/User');

exports.Login = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.json({ message: 'No account exists associated with this email' });
    }
    if (!user.comparePassword(req.body.password)) {
      res.json({ message: 'Password is incorrect' });
    }
    console.log('Login Successful!');
  });
};

exports.Register = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      res.json({ message: 'Email already in use' });
    } else {
      const usr = new User();
      usr.fName = req.body.fName;
      usr.sName = req.body.sName;
      usr.dob = req.body.dob;
      usr.password = await usr.generateHash(req.body.password, crypto.randomBytes(32));
      usr.email = req.body.email;
      usr.save();
    }
  });
};
