const Buffer = require('safer-buffer').Buffer;
const request = require('request');

const User = require('../models/User');

const clientId = process.env.clientID;
const secretId = process.env.secretID;
const redirectUri = 'http://danu7.it.nuigalway.ie:8632/spotify/reqCallback';
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
        grant_type: 'authorization_code',
      },
      headers: {
        'Authorization': 'Basic ' + ((Buffer.from(clientId + ':' + secretId)).toString('base64')),
      },
      json: true,
    };

    request.post(authOptions, (err, response, body) => {
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
          res.redirect('/spotify/retrieveDetails');
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
        res.send(body.access_token);
      }
    });
  },
  retrieveDetails: (req, res, next) => {
    // Retrieve current user's refresh token, then use refresh route
    /*request.get(`http://danu7.it.nuigalway.ie:8632/spotify/refAccess`).then((error, response, body) => {
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
    });*/

    const authOptionsArtists = {
      url: `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`,
      headers: {'Authorization': `Bearer ${req.user.access_token}`},
      json: true,
    };

    const authOptionsGenres = {
      url: `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`,
      headers: {'Authorization': `Bearer ${req.user.access_token}`},
      json: true,
    };
    Promise.all([arrayArtists(authOptionsArtists), mapGenres(authOptionsGenres)]).then((values) => {
      User.findOne({_id: req.user._id}).exec((err, user) => {
        if (err) {
          return res.json({error: err});
        }
        if (!user) {
          return res.json({message: 'User not found'});
        }
        user.artists = values[0];
        user.genres = values[1];
        user.save((err, usr) => {
          res.redirect('/profile/' + usr._id);
        });
      });
    }).catch((err) => console.log(err));
  },
};

// Promise to return hash map of Genres
function mapGenres(authOptions) {
  return new Promise((resolve, reject) => {
    const genreMap = new Map();
    request.get(authOptions, (err, response, body) => {
      if (err) {
        reject(err);
      }
      const items = body.items;
      items.forEach((item, index) => {
        const genres = item.genres;
        genres.forEach((genre, index) => {
          if (!genreMap.has(genre)) {
            genreMap.set(genre, 0);
          }
          genreMap.set(genre, genreMap.get(genre) + 1);
        });
      });
      resolve(genreMap);
    });
  });
}

function arrayArtists(authOptions) {
  return new Promise((resolve, reject) =>
    request.get(authOptions, (err, response, body) => {
      const artistArray = [];
      if (err) {
        reject(err);
      }
      const items = body.items;
      items.forEach((item, index) => {
        artistArray.push(item);
      });
      resolve(artistArray);
    }));
}
