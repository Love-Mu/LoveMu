const {body, validationResult} = require('express-validator');

module.exports = {
  registrationValidationRules: () => {
    return [body('email').isEmail(), body('password').isLength({min: 5}), body('user_name').trim().isLength({min: 5, max:20}), body('gender').notEmpty(), body('sexuality').notEmpty(), body('dob').notEmpty(), body('fname').notEmpty(), body('sname').trim().notEmpty(), body('location').notEmpty().trim()];
  },
  messageValidationRules: () => {
    return [body('message').trim().escape().notEmpty()]
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
}