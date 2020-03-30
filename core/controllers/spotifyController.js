const Buffer = require('safer-buffer').Buffer;
const request = require('request');
const querystring = require('querystring');

const User = require('../models/User');

const clientId = process.env.clientID;
const secretId = process.env.secretID;
const redirectUri = 'https://lovemu.compsoc.ie/spotify/reqCallback';
const scope = 'user-top-read playlist-read-private';

/* We need to save the access and refresh tokens to each user
  - The access token is used to make calls to the Spotify API and
  retrieve the user's data
  - The refresh token is used in the event of an access token expiring,
  the token will be included in the request body (refreshToken route)
  the new access token must be saved to User */

module.exports = {
  requestAccess: (req, res, next) => {
    return res.redirect(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`);
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
        const access_token = body.access_token;
        res.redirect('https://lovemu.compsoc.ie/?' + querystring.stringify({spotify_token: access_token}));
      } else {
        throw (err);
      }
    });
  },

  retrieveDetails: (req, res, next) => {
    const authOptionsArtists = {
      method:"get",
      url: `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`,
      headers: {'Authorization': `Bearer ${req.body.access_token}`},
      json: true,
    };

    const authOptionsGenres = {
      method:"get",
      url: `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`,
      headers: {'Authorization': `Bearer ${req.body.access_token}`},
      json: true,
    };

    const authOptionsPlaylists = {
      method:"get",
      url: `https://api.spotify.com/v1/me/playlists?limit=50`,
      headers: {'Authorization': `Bearer ${req.body.access_token}`},
      json: true,
    };
    Promise.all([mapArtists(authOptionsArtists), mapGenres(authOptionsGenres), retrievePlaylists(authOptionsPlaylists)]).then((values) => {
      User.findOne({_id: req.user._id}).exec((err, user) => {
        if (err) {
          return res.json({error: err});
        }
        if (!user) {
          return res.json({message: 'User not found'});
        }
        user.artists = values[0];
        user.genres = values[1];
        user.playlists = values[2];
        user.save((err) => {
          if (err) {
            return res.json({error: err});
          }
          return res.json({message: 'Successfully Retrieved Details!'});
        });
      });
    }).catch((err) => {
      console.log(err);
      return res.status(404).json({message: 'Error in Retrieving Details', error: err
    })});
  },
};

// Promise to return hash map of Genres
function mapGenres(authOptions) {
  return new Promise((resolve, reject) => {
    const genreMap = new Map();
    request(authOptions, async (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (response.statusCode !== 200) {
        reject({message: 'Unauthorized Request'});
      }
      const items = await body.items;
      if (items != null) {
        items.forEach((item, index) => {
          const genres = item.genres;
          genres.forEach((genre, index) => {
            if (!genreMap.has(genre)) {
              genreMap.set(genre, 0);
            }
            genreMap.set(genre, genreMap.get(genre) + 1);
          });
        });
      }
      resolve(genreMap);
    });
  });
}

function mapArtists(authOptions) {
  return new Promise((resolve, reject) => {
    request(authOptions, async (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (response.statusCode !== 200) {
        reject({message: 'Unauthorized Request'});
      }
      const artistMap = new Map();
      const items = await body.items;
      if (items != null) {
        items.forEach((item, index) => {
          artistMap.set(item.name, item);
        });
      } 
      resolve(artistMap);
    })});
  }

  function retrievePlaylists(authOptions) {
    return new Promise((resolve, reject) => {
      request(authOptions, async (err, response, body) => {
        if (err) {
          reject(err);
        }
        if (response.statusCode !== 200) {
          reject({message: 'Unauthorized Request'});
        }
        const playlists = await body.items;
        resolve(playlists);
      });
    });
  }

 /* // Promise to return hash map of Genres
function mapGenres(authOptions) {
  return new Promise((resolve, reject) => {
    const genreMap = new Map();
    request.get(authOptions, async (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (response.statusCode !== 200) {
        reject({message: 'Unauthorized Request'});
      }
      const items = await body.items;
      if (items != null) {
        items.forEach((item, index) => {
          const genres = item.genres;
          genres.forEach((genre, index) => {
            if (!genreMap.has(genre)) {
              genreMap.set(genre, 0);
            }
            genreMap.set(genre, genreMap.get(genre) + 1);
          });
        });
      }
      resolve(genreMap);
    });
  });
}

function mapArtists(authOptions) {
  return new Promise((resolve, reject) => {
    request.get(authOptions, async (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (response.statusCode !== 200) {
        reject({message: 'Unauthorized Request'});
      }
      const artistMap = new Map();
      const items = await body.items;
      if (items != null) {
        items.forEach((item, index) => {
          artistMap.set(item.name, item);
        });
      } 
      resolve(artistMap);
    })});
  }

  function retrievePlaylists(authOptions) {
    return new Promise((resolve, reject) => {
      request.get(authOptions, async (err, response, body) => {
        if (err) {
          reject(err);
        }
        if (response.statusCode !== 200) {
          reject({message: 'Unauthorized Request'});
        }
        const playlists = await body.items;
        resolve(playlists);
      });
    });
  }*/