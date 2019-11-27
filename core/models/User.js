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

UserSchema.methods.generateHash = async (password) => bcrypt.hash(password, 10);

module.exports = mongoose.model('User', UserSchema);
