const express = require('express');

const spotify = require('../controllers/spotify');

const router = express.Router();

router.get('/auth', spotify.Auth);

router.get('/callback', spotify.Callback);

router.get('/refresh', spotify.Refresh);

router.get('/retrieveArtists', spotify.RetrieveArtists);

module.exports = router;
