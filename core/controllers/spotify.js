const clientId = process.env.clientID;
const secretId = process.env.secretID;
const redirectUri = 'https://lovemu.azurewebsites.net/spotify/reqCallback';
const scope = 'user-top-read';
const Buffer = require('safer-buffer').Buffer;
const request = require('request');

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
        'Authorization': `Basic ${
          (Buffer.from(clientId + ':' + secretId)).toString('base64')
        }`,
      },
      json: true,
    };

    request.post(authOptions, (err, response, body) => {
      if (!err && response.status == 200) {
        const accessToken = body.access_token;
        const refreshToken = body.refresh_token;
        res.json({accessToken, refreshToken});
        // Save tokens here
      }
    });
  },

  refreshAccess: (req, res, next) => {
    const requestToken = query.body.refresh_token;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {'Authorization': `Basic ${
        new Buffer(clientId + ':' + secretId).toString('base64')
      }`},
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
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

  retrieveArtists: (req, res, next) => {
    const accessToken = req.accessToken;
    const authOptions = {
      url: `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`,
      headers: {'Authorization': `Bearer ${accessToken}`},
      json: true,
    };

    request.get(`https://lovemu.azurewebsites.net/spotify/refreshToken?request_token=${query.accessToken}`); // Need to insert current user's request token here

    request.get(authOptions, (err, response, next) => {
      res.json(response);
      /* Need to save Artist data here
      https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
      for response formmat */
    });
  },
};
