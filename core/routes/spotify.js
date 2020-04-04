const express = require('express');
const router = express.Router();
const passport = require('passport');

const Spotify = require('../controllers/spotifyController');

router.get('/reqAccess', Spotify.requestAccess);

router.get('/reqCallback', Spotify.callbackAccess);

router.post('/retrieveDetails', passport.authenticate('jwt', {session: false}), Spotify.retrieveDetails);

router.post('/refreshAccess', passport.authenticate('jwt', {session: false}), Spotify.refreshAccess);

router.post('/storeToken', passport.authenticate('jwt', {session: false}), Spotify.storeToken);

router.post('/search', passport.authenticate('jwt', {session: false}), Spotify.search);

module.exports = router;