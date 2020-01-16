const express = require('express');

const Authentication = require('../controllers/authController');
const Assets = require('../assets/miscAssets');

const router = express.Router();

router.post('/register', Authentication.register);

router.post('/login', Authentication.login);

router.post('/logout', Assets.authMiddleware, Authentication.logout);

module.exports = router;
