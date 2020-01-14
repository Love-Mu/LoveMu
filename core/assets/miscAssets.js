module.exports = {
  checkSession: (req, res, next) => {
    if (req.session.userId) { // userId is a unique variable assigned upon user login
      return next();
    }
    res.redirect('/');
  },
};