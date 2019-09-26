const express = require('express');

const login = require('../controllers/login');

const router = express.Router();

router.post('/', login.LogIn);

router.post('/register', login.Register);
