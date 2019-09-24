const express = require('express');

const spotify = require('../controllers/spotify');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/api');
});

router.get('/api/spotifyAuth', spotify.spotifyAuth);

module.exports = router;
