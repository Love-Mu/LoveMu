const express = require('express');
const {check} = require('express-validator');

const Authentication = require('../controllers/authController');

const router = express.Router();

router.post('/register', [check('email').isEmail(), check('password')], Authentication.register);

router.post('/login', Authentication.login);

router.post('/logout', Authentication.logout);

module.exports = router;
