const express = require('express');

const spotify = require('../controllers/spotify');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/api');
});

router.get('/api/spotify/auth', spotify.Auth);

router.get('/api/spotify/callback', spotify.Callback);

router.get('/api/spotify/refresh', spotify.Refresh);

module.exports = router;
