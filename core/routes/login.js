const express = require('express');

const login = require('../controllers/login');

const router = express.Router();

router.post('/login', login.Login);

router.post('/register', login.Register);

module.exports = router;
