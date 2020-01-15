const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

// Define User model here
const User = new Schema({

});

User.pre('save', async function hashPass(next) {
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

User.methods.comparePassword = async function compPass(password, callback) {
  bcrypt.compare(password, this.password, function(err, result) {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};
module.exports = mongoose.model('User', User);
