const express = require('express');

const Authentication = require('../controllers/auth');

const router = express.Router();

router.get('/register');

router.get('/login');

router.get('/logout');

module.exports = router;
