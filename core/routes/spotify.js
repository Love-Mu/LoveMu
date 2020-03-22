const express = require('express');
const router = express.Router();
const passport = require('passport');

const Spotify = require('../controllers/spotifyController');
const { isAuthed } = require('../config/validator');

router.get('/reqAccess', passport.authenticate('jwt', {session: false}), Spotify.requestAccess);

router.get('/reqCallback', passport.authenticate('jwt', {session: false}), Spotify.callbackAccess);

router.get('/refToken', passport.authenticate('jwt', {session: false}), Spotify.refreshAccess);

router.get('/retrieveDetails', passport.authenticate('jwt', {session: false}), Spotify.retrieveDetails);

module.exports = router;