const express = require('express');
const {check} = require('express-validator');
const passport = require('passport');
const request = require('request');

const { userValidationRules, validate } = require('../config/validator');

const Authentication = require('../controllers/authController');

const router = express.Router();

router.post('/register', userValidationRules(), validate, Authentication.register);

router.post('/login',  userValidationRules(), validate, Authentication.login);

router.get('/query', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let id = req.user._id;
    res.status(200).json({message: 'Successful Login!', id});
});

module.exports = router;
