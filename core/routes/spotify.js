const express = require('express');

const Spotify = require('../controllers/spotify');
const Assets = require('../assets/miscAssets');
const router = express.Router();

router.get('/reqAccess', Assets.checkSession, Spotify.requestAccess);

router.get('/reqCallback', Spotify.callbackAccess);

router.get('/refToken', Assets.checkSession, Spotify.refreshAccess);

router.get('/retArtists', Assets.checkSession, Spotify.retrieveArtists);

module.exports = router;
