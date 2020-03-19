const {body, validationResult} = require('express-validator');

module.exports = {
  userValidationRules: () => {
    return [body('email').isEmail(), body('password').isLength({min: 5})];
  },
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const sanitizedErrors = [];
    errors.array().map(err => sanitizedErrors.push({ [err.param]: err.msg}));
    return res.status(422).json({errors: sanitizedErrors})
  },
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(403).json({ message: "Not Authenticated"});
  }
}