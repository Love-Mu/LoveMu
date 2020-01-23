const User = require('../models/User');

// Need to write validation functions to parse and validate user data

module.exports = {
  register: (req, res, next) => {
    // Create a User object here, ensuring that a User with the same email/username doesn't currently exist
    
    //check if exists already
    if(db.getCollection('user').find({'email' : req.email }).count() > 0){
      res.json({
        success: false,
        message: 'Email already part of account',
      });
    }
    else if(db.getCollection('user').find({'user_name' : req.user_name }).count() > 0){
      res.json({
        success: false,
        message: 'Username in use',
      });
    }
    else{
      db.getCollection('user').save({email:req.email});
    }


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