const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

require('./util'); //Util contains login details, remove file before posting to github

// Define User model here
const User = new Schema({
  email: {type: String},
  salt: {type: String},
  hash: {type: String},
  access_token: {type: String},
  user_name: {type: String, default: ""},
  fname: {type: String, default: ""},
  sname: {type: String, default: ""}, 
  date_of_birth: {type: Date},
  location: {type: String, default: ""},
  image: {type: String, default : ""}, //temporary, need to replace with actual image storage
  gender: {type: String, default: ""},
  sexuality: {type: String, default: ""},
  bio: {type: String, default: ""}
});

User.pre('save', function hashPass(next) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(this.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      // Save hashed password here

      next();
    });
  });
});

User.methods.comparePassword = function compPass(password, callback) {
  bcrypt.compare(password, this.password, function(err, result) {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};
module.exports = mongoose.model('User', User);
