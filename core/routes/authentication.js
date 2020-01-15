const express = require('express');

const Authentication = require('../controllers/auth');

const router = express.Router();

router.post('/register', Authentication.registerUser);

router.post('/login', Authentication.login);

router.post('/logout', Authentication.logout);

module.exports = router;
