const express = require('express');
const {check} = require('express-validator');
const passport = require('passport');
const { userValidationRules, validate } = require('../config/validator');

const Authentication = require('../controllers/authController');

const router = express.Router();

router.post('/register', userValidationRules(), validate, Authentication.register);

router.post('/login',  userValidationRules(), validate, passport.authenticate('local-login', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure',
}));

router.get('/success', (req, res, next) => {
    res.status(200).json({message: 'Successful Login!'});
});

router.get('/failure', (req, res, next) => {
    res.status(404).json({message: 'Unsuccessful Login!'});
});

module.exports = router;
