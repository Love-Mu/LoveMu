const express = require('express');
const router = express.Router();

const Spotify = require('../controllers/spotifyController');
const { ensureAuthenticated } = require('../config/validator');

router.get('/reqAccess', ensureAuthenticated, Spotify.requestAccess);

router.get('/reqCallback', ensureAuthenticated, Spotify.callbackAccess);

router.get('/refToken', ensureAuthenticated, Spotify.refreshAccess);

router.get('/retrieveDetails', ensureAuthenticated, Spotify.retrieveDetails);

module.exports = router;