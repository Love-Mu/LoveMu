const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Invalid Token' });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.json({ success: false, message: 'No Authorization Token Provided' });
  }
};

exports.Login = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.json({ message: 'No account exists associated with this email' });
      return;
    }
    user.comparePassword(req.body.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ username: req.body.username },
          process.env.secret,
          { expiresIn: '24h' });
        res.json({ success: true, message: 'Authentication Successful', token });
      } else {
        res.send(400).json( { success: false, message: 'Authentication Failed!' } );
      }
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
