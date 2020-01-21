const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');

const Schema = mongoose.Schema;

// Define User model here
const userSchema = new Schema({});

User.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', userSchema);
