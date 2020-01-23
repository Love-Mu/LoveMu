const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');

const Schema = mongoose.Schema;

// Define User model here
const userSchema = new Schema({
  email: {type: String},
  password: {type: String},
  access_token: {type: String},
  refresh_token: {type: String},
  artists: {type: Array},
  genres: {type: Map},
  user_name: {type: String, default: ""},
  fname: {type: String, default: ""},
  sname: {type: String, default: ""}, 
  date_of_birth: {type: Date},
  location: {type: String, default: ""},
  image: {type: String, default : ""}, // temporary, need to replace with actual image storage
  gender: {type: String, default: ""},
  sexuality: {type: String, default: ""},
  bio: {type: String, default: ""}
});

userSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
