const express = require('express');
const router = express.Router();
const passport = require('passport');

const Spotify = require('../controllers/spotifyController');
const { isAuthed } = require('../config/validator');

router.get('/reqAccess', Spotify.requestAccess);

router.get('/reqCallback', Spotify.callbackAccess);

router.post('/retrieveDetails', passport.authenticate('jwt', {session: false}), Spotify.retrieveDetails);

module.exports = router;