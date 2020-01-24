const express = require('express');
const {check} = require('express-validator');
const passport = require('passport');

const Authentication = require('../controllers/authController');

const router = express.Router();

router.get('/register', (req, res, next) => {
  res.send('index.html');
});

router.post('/register', [check('email').isEmail(), check('password')], Authentication.register);

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile/',
    failureRedirect: '/auth/login',
  }));

router.post('/logout', Authentication.logout);

module.exports = router;
