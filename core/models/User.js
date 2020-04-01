const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Define User model here
const userSchema = new Schema({
  email: {
    type: String, 
    unique: true, 
  },
  password: {
    type: String
  },
  user_name: {
    type: String, 
    default: "",
    unique: true
  },
  access_token: {
    type: String,
    default: ""
  },
  refresh_token: {
    type: String,
    default: ""
  },
  artists: {
    type: Map,
    default: new Map()
  },
  genres: {
    type: Map,
    default: new Map()
  },
  playlists: {
    type: [],
    default: []
  },
  fname: {
    type: String, 
    default: ""
  },
  sname: {
    type: String, 
    default: ""
  },
  dob: {
    type: Date
  },
  location: {
    type: String, 
    default: ""
  },
  image: {
    type: String, 
    default : ""
  }, // Let's try imgur here
  gender: {
    type: String, 
    default: ""
  },
  sexuality: {
    type: Array,
    default: ""
  },
  bio: {
    type: String, 
    default: ""
  },
  playlist: {
    type: String,
    default: ""
  },
  favouriteSong: {
    type: String,
    default: ""
  },
  complete: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.hashPassword = function(password) {
  return new Promise((resolve, reject) => {
    resolve(bcrypt.hashSync(password, bcrypt.genSaltSync(8), null));
  });
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
