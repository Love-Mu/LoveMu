const express = require('express');
const Authentication = require('../controllers/authController');

const router = express.Router();

router.post('/register', Authentication.register);

router.post('/login', Authentication.login);

router.post('/logout', Authentication.logout);

module.exports = router;
