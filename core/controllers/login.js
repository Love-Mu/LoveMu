const bcrypt = require('bcrypt');

const User = require('../models/User');

exports.Login = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.json({ message: 'No account exists associated with this email' });
      return;
    }
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        console.log(err);
        return;
      }
      if (isMatch) {
        res.json({ message: 'Successful Login' });
      } else {
        res.json({ message: 'Incorrect Password' });
      }
    });
  }).catch((err) => console.log(err));
};

exports.Register = (req, res) => {
  User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      await res.json({ message: 'Email already in use' });
    } else {
      const usr = new User({
        fName: req.body.fName,
        sName: req.body.sName,
        dob: req.body.dob,
        email: req.body.email,
      });
      usr.password = await usr.generateHash(req.body.password);
      console.log(usr);
      usr.save();
      await res.json({ message: 'Success!' });
    }
  }).catch((err) => console.log(err));
};
