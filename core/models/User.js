const mongoose = require('mongoose');
const argon2i = require('argon2-ffi').argon2i;

// Define User model here 
const User;

User.methods.hashPassword = async function hashPass(password) {
  crypto.randomBytes(32, function (err, salt) {
    if (err) throw err;
    argon2i.hash(password, salt).then((hash) => {
      // Save hashed password here
    })
  });
}

User.methods.comparePassword = async function compPass(password) {
  // "pass" is the password of the current User (According to login email)
  argon2i.verify(storedHash, password).then((correct) => {
    if (correct) {
      // Create user session
    } else {
      // Incorrect password
    }
  })
}