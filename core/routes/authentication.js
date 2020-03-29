const express = require('express');
const {check} = require('express-validator');
const passport = require('passport');
const request = require('request');

const { registrationValidationRules, validate } = require('../config/validator');

const Authentication = require('../controllers/authController');

const router = express.Router();


router.post('/register', registrationValidationRules(), validate, Authentication.register);

router.post('/login', Authentication.login);

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', {session: false}), Authentication.google);

module.exports = router;