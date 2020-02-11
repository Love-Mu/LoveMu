const express = require('express');
const {check} = require('express-validator');
const passport = require('passport');
const { userValidationRules, validate } = require('../config/validator');

const Authentication = require('../controllers/authController');

const router = express.Router();

router.post('/register', userValidationRules(), validate, Authentication.register);

router.post('/login',  userValidationRules(), validate, passport.authenticate('local-login', {
    successRedirect: '/profile/',
    failureRedirect: '/',
}));

router.get('/google', passport.authenticate('google', { scope: 
    [ 'https://www.googleapis.com/auth/plus.login',
    , 'https://www.googleapis.com/auth/plus.profile.emails.read'}
));

router.get('/googleCallback', passport.authenticate('google', {
    successRedirect: '',
    failureRedirect: ''
}))
module.exports = router;
