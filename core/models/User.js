const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;



// Define User model here
const userSchema = new Schema({
  email: {
    type: String, 
    unique: true, 
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },
  password: {
    type: String,
    trim: true,
    required: "Password is Required"
  },
  access_token: {
    type: String
  },
  refresh_token: {
    type: String
  },
  artists: {
    type: Array
  },
  genres: {
    type: Map
  },
  user_name: {
    type: String, 
    default: ""
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
    type: Number, 
    default: ""
  },
  pronouns: {
    type: String,
    default: ""
  },
  sexuality: {
    type: Number,
    default: ""
  },
  bio: {
    type: String, 
    default: ""
  }
});

userSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
