const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: String,
  fName: String,
  sName: String,
  dob: Date,
  password: String,
  accessToken: String,
  refreshToken: String,
});

UserSchema.methods.generateHash = function (password) {
  bcrypt.hash(password, 10);
};

UserSchema.methods.comparePassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return next(err);
    }
    return next(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
