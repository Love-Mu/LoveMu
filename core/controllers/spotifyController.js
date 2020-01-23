const Buffer = require('safer-buffer').Buffer;
const request = require('request-promise');

const User = require('../models/User');

const clientId = process.env.clientID;
const secretId = process.env.secretID;
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

    request.post(authOptions, function (err, response, body) {
      if (!err && response.statusCode === 200) {
        const accessToken = body.access_token;
        const refreshToken = body.refresh_token;
        // Save tokens here
        User.findOne({_id: req.user._id}).exec((err, user) => {
          if (err) {
            return res.json({error: err});
          }
          if (!user) {
            return res.json({message: 'User not found'});
          }
          user.access_token = accessToken;
          user.refresh_token = refreshToken;
          user.save();
          res.json({message: 'Success!'});
        });
      } else {
        throw (err);
      }
    });
  },

  refreshAccess: (req, res, next) => {
    const refreshToken = req.user.refresh_token; // use this to find User's refresh token
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
        res.json(accessToken);
      }
    });
  },
  retrieveDetails: (req, res, next) => {
    // Retrieve current user's refresh token, then use refresh route
    request.get(`https://lovemu.compsoc.ie/spotify/refAccess?refTok=${req.user.refresh_token}`, (error, response, body) => {
      if (!error) {
        User.findOne({_id: req.user._id}).exec((err, user) => {
          if (err) {
            return res.json({error: err});
          }
          if (!user) {
            return res.json({message: 'User not found'});
          }
          user.access_token = body.accessToken;
          user.save();
        });
      }
    });

    // Retrieve current user's access token
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
        genres.forEach((genre, index) => {
          if (!genreMap.has(genre)) {
            genreMap.set(genre, 0);
          }
          genreMap.set(genre, genreMap.get(genre) + 1);
        });
      });
    });

    authOptions.url = `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term`;

    request.get(authOptions, (err, response, body) => {
      const items = JSON.parse(body.items);
      items.forEach((item, index) => {
        artistArray.push(item);
      });
    });
    // Save map and array here to current user
    User.findOne({_id: req.user._id}).exec((err, user) => {
      if (err) {
        return res.json({error: err});
      }
      if (!user) {
        return res.json({message: 'User not found'});
      }
      user.genres = genreMap;
      user.artists = artistArray;
      user.save();
      res.json(user);
    });
  },
};