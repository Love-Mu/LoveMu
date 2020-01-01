const clientId = process.env.clientID;
const secretId = process.env.secretID;
const redirectUri = 'http://localhost:8000/spotify/reqCallback';
const scope = 'user-top-read';
const Buffer = require('safer-buffer').Buffer;

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
        'Authorization': `Basic${
          (Buffer.from(clientId + ':' + sClientId)).toString('base64')
        }`,
      },
      json: true,
    };

    request.post(authOptions, (err, response, body) => {
      if (!err && response.status == 200) {
        const accessToken = body.access_token;
        const refreshToken = body.refresh_token;

        // Save tokens here
      }
    });
  },
};
