module.exports = {
  registerUser: (req, res, next) => {
    // Create a User object here, ensuring that a User with the same email/username doesn't currently exist
  },

  login: (req, res, next) => {
    // Find User based on email and use comparePassword method
  },

  logout: (req, res, next) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          throw err;
        }
      });
    }
  },
};