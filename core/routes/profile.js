const express = require('express');

const Profile = require('../controllers/profileController');
const Assets = require('../assets/miscAssets');

const router = express.Router();

router.get('/', Assets.authMiddleware, Profile.getProfiles);

router.get('/:id', Assets.authMiddleware, Profile.getProfile);

module.exports = router;
