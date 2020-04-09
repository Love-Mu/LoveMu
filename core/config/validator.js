const {body, validationResult} = require('express-validator');

module.exports = {
  registrationValidationRules: () => {
    return [body('email').isEmail(), body('password').isLength({min: 5}), body('user_name').trim().isLength({min: 5, max:20}).isWhitelisted("_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"), body('gender').notEmpty().trim(), body('sexuality').notEmpty().trim(), body('dob').notEmpty().trim(), body('fname').notEmpty().trim(), body('sname').trim().notEmpty(), body('location').notEmpty().trim(), body('bio').trim().isLength({min:3, max:250})];
  },
  updateValidationRules: () => {
    return [body('user_name').trim().isLength({min: 5, max: 20}), body('gender').notEmpty(), body('sexuality').notEmpty(), body('dob').notEmpty(),body('fname').notEmpty(), body('sname').trim().notEmpty(), body('location').notEmpty().trim()];
  },
  loginValidationRules: () => {
    return [body('email').trim().isLength({min: 5, max:20}), body('password').isLength({min: 5})];
  },
  messageValidationRules: () => {
    return [body('body').trim().isLength({min: 1, max:2000})];
  },
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const sanitizedErrors = [];
    errors.array().map(err => sanitizedErrors.push({ [err.param]: err.msg}));
    return res.status(422).json({errors: sanitizedErrors})
  }
}