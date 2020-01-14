const express = require('express');

const Spotify = require('../controllers/spotify');
const Assets = require('../assets/miscAssets');
const router = express.Router();

router.get('/reqAccess', Spotify.requestAccess);

router.get('/reqCallback', Spotify.callbackAccess);

router.get('/refToken', Spotify.refreshAccess);

router.get('/retrievePersonalDetails', Spotify.retrievePersonalizationDetails);

module.exports = router;
