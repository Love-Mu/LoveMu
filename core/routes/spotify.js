const express = require('express');
const request = require('request');

const Spotify = require('../controllers/spotify');

const router = express.Router();

router.get('/reqAccess', Spotify.requestAccess);

router.get('/reqCallback', Spotify.callbackAccess);

router.get('/refToken', Spotify.refreshAccess);

router.get('/retArtists', Spotify.retrieveArtists);

module.exports = router;
