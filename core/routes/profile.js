const express = require('express');
const passport = require('passport');
const Profile = require('../controllers/profileController');
const { userValidationRules, validate } = require('../config/validator');

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), Profile.getProfiles);

router.get('/:id', passport.authenticate('jwt', {session: false}), Profile.getProfile);

router.put('/:id', passport.authenticate('jwt', {session: false}), Profile.updateProfile);

router.get('/block/:id', passport.authenticate('jwt', {session: false}), Profile.block);

router.get('/unblock/:id', passport.authenticate('jwt', {session: false}), Profile.unblock);

router.post('/removeArtist', passport.authenticate('jwt', {session: false}), Profile.removeArtist);

router.post('/addArtist', passport.authenticate('jwt', {session: false}), Profile.addArtist);

module.exports = router;