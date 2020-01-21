const Buffer = require('safer-buffer').Buffer;
const request = require('request-promise');
const similarity = require('compute-cosine-similarity');

const User = require('../models/User');

const config = require('../../config.js');
const clientId = config.clientID;
const secretId = config.secretID;
const redirectUri = 'https://lovemu.compsoc.ie/spotify/reqCallback';
const scope = 'user-top-read';

/* We need to save the access and refresh tokens to each user
  - The access token is used to make calls to the Spotify API and
  retrieve the user's data
  - The refresh token is used in the event of an access token expiring,
  the token will be included in the request body (refreshToken route)
  the new access token must be saved to User */

module.exports = {
  requestAccess: (req, res, next) => {
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`);
  },

  callbackAccess: (req, res, next) => {
    const code = req.query.code || null;

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
       'Authorization': 'Basic ' + ((Buffer.from(clientId + ':' + secretId)).toString('base64')),
      },
      json: true,
    };

    request.post(authOptions, async function(err, response, body) {
      if (!err && response.statusCode === 200) {
        const accessToken = body.access_token;
        const refreshToken = body.refresh_token;
        // Save tokens here
      } else {
        throw (err);
      }
    });
  },

  refreshAccess: (req, res, next) => {
    const refreshToken = query.body.refresh_token;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + ((Buffer.from(clientId + ':' + secretId)).toString('base64')),
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      json: true,
    };
    request.post(authOptions, (error, response, body) => {
      if (!error && response.status === 200) {
        const accessToken = body.access_token;
        // Save new access token here
        res.json(accessToken);
      }
    });
  },

  retrievePersonalizationDetails: (req, res, next) => {
    // Find User here and refresh token

    const genreMap = new Map();
    const artistArray = {};

    const authOptions = {
      url: `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`,
      headers: {'Authorization': `Bearer ${accessToken}`},
      json: true,
    };

    request.get(authOptions, (err, response, body) => {
      const items = JSON.parse(body.items);
      items.forEach((item, index) => {
        const genres = item.genres;
        genres.forEach((item, index) => {
          if (!genreMap.has(item)) {
            genreMap.set(item, 0);
          }
          genreMap.set(item, genreMap.get(item) + 1);
        });
        if (!artistArray.includes(item.name)) {
          artistArray.add(item.name);
        }
      });
    });

    authOptions.url = `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term`;

    request.get(authOptions, (err, response, body) => {
      const items = JSON.parse(body.items);
      items.forEach((item, index) => {
        const artist = item.album.artists[0].name;
        if (!artistArray.includes(artist)) {
          artistArray.add(artist);
        }
      });
    });
    const scores = {};

    // Need to save Artist and Genre data here
  },
};
