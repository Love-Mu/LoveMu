const express = require('express');
const {check} = require('express-validator');
const passport = require('passport');

const Authentication = require('../controllers/authController');

const router = express.Router();

router.get('/register', (req, res, next) => {
  res.send('index.html');
});

router.post('/register', [check('email').isEmail().trim(), check('password').isLength({min: 5})], Authentication.register);

router.post('/login', [check('email').isEmail().trim(), check('password').isLength({min: 5})], passport.authenticate('local-login', {
    successRedirect: '/profile/',
    failureRedirect: '/',
  }));

router.post('/logout', Authentication.logout);

module.exports = router;
