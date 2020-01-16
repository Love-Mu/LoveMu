const express = require('express');
const router = express.Router();

const Spotify = require('../controllers/spotifyController');
const Assets = require('../assets/miscAssets');

router.get('/reqAccess', Spotify.requestAccess);

router.get('/reqCallback', Spotify.callbackAccess);

router.get('/refToken', Spotify.refreshAccess);

router.get('/retrievePersonalDetails', Spotify.retrievePersonalizationDetails);

module.exports = router;
