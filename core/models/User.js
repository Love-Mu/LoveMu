const mongoose = require('mongoose');
const bcrypt = require();

// Define User model here 
const User;

User.methods.hashPassword = async function hashPass(plaintext) {
  bcrypt.hash(plaintext, 10).then(function (hash) {
    // Store password hash here

  });
}

User.methods.comparePassword = async function compPass(plaintext) {
  // "pass" is the password of the current User (According to login email)
  bcrypt.compare(plaintext, pass).then(function (res) {
    if (res == true) {

    } else {

    }
  });
}