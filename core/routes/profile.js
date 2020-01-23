const express = require('express');

const Profile = require('../controllers/profileController');

const router = express.Router();

router.get('/', Profile.getProfiles);

router.get('/:id', Profile.getProfile);

module.exports = router;
