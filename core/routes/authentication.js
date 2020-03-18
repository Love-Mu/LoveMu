const express = require('express');
const {check} = require('express-validator');
const passport = require('passport');
const request = require('request');

const { userValidationRules, validate } = require('../config/validator');

const Authentication = require('../controllers/authController');

const router = express.Router();

router.post('/register', userValidationRules(), validate, Authentication.register);

router.post('/login',  userValidationRules(), validate, passport.authenticate('local-login', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure',
}));

router.get('/success', (req, res, next) => {
    if (req.isAuthenticated()) {
        let id = req.user.id;
        res.status(200).json({message: 'Successful Login!', user: id});
    } else {
        res.redirect('/auth/failure');
    }
});

router.get('/failure', (req, res, next) => {
    res.status(403).json({message: 'Unsuccessful Login!'});
});

router.get('/query', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.send(true);
    }
    return res.send(false);
})

router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).json({message: 'Logged Out'});
})

module.exports = router;
