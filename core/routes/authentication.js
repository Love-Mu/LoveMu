const express = require('express');
const {check} = require('express-validator');
const passport = require('passport');
const request = require('request');

const { userValidationRules, validate } = require('../config/validator');

const Authentication = require('../controllers/authController');

const router = express.Router();
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage })

//router.post('/register', userValidationRules(), validate, Authentication.register);

router.post('/register', userValidationRules(), validate, upload.single('profile'), Authentication.register);

router.post('/login',  userValidationRules(), validate, Authentication.login);

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', {session: false}), Authentication.google);

module.exports = router;