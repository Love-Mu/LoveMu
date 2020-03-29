const {body, validationResult} = require('express-validator');

module.exports = {
  registrationValidationRules: () => {
    return [body('email').isEmail().normalizeEmail(), body('password').isLength({min: 5}), body('user_name').trim().isLength({min: 5, max:20}), body('gender').escape().notEmpty(), body('sexuality').escape().notEmpty(), body('dob').notEmpty(), body('fname').notEmpty().escape(), body('sname').trim().notEmpty().escape(), body('location').notEmpty().trim().escape()];
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