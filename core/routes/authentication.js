const express = require('express');

const Authentication = require('../controllers/auth');

const router = express.Router();

router.get('/register', Authentication.registerUser);

router.get('/login', Authentication.login);

router.get('/logout', Authentication.logout);

module.exports = router;
