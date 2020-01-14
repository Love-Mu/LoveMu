const mongoose = require('mongoose');
const argon2i = require('argon2-ffi').argon2i;

// Define User model here 
const User;

User.pre('save', async function hashPass() {
  crypto.randomBytes(32, function (err, salt) {
    if (err) throw err;
    argon2i.hash(User.password, salt).then((hash) => {
      // Save hashed password here


      next();
    })
  });
});

User.methods.comparePassword = async function compPass(password) {
  argon2i.verify(storedHash, password).then((correct) => {
    if (correct) {
      // Create user session
      req.session.userId = this.userId;
    } else {
      // Incorrect password
      res.send('Incorrect Password!');
    }
  })
}