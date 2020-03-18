const express = require('express');

const Profile = require('../controllers/profileController');
const { userValidationRules, validate, ensureAuthenticated } = require('../config/validator');

const router = express.Router();

router.get('/', ensureAuthenticated, Profile.getProfiles);

router.get('/:id', ensureAuthenticated, Profile.getProfile);

router.put('/:id', ensureAuthenticated, Profile.updateProfile);

module.exports = router;