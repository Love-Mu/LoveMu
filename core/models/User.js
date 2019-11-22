const mongoose = require('mongoose');
const { argon2i } = require('argon2-ffi');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: String,
  fName: String,
  sName: String,
  dob: Date,
  password: String,
  refreshToken: String,
});

UserSchema.methods.generateHash = (password, salt) => argon2i.hash(password, salt);

UserSchema.methods.comparePassword = async (password) => {
  return argon2i.verify(this.password, password, (err) => {
    if (err) {
      throw err;
    }
    return true;
  });
};

module.exports = mongoose.model('User', UserSchema);
