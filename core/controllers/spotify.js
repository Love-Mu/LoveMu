const request = require('request');
const queryString = require('query-string');

const clientId = '7cf1414999bf4006b28cb368b2d45693';
const sClientId = process.env.SECRET;
const redirectUri = 'http://lovemu.compsoc.ie:8001/api/spotifyAuthCallback';

exports.spotifyAuth = (req, res) => {
  const scope = 'user-library-read';
  res.redirect(`https://accounts.spotify.com/authorize?${queryString.stringify({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
  })}`);
};

exports.spotifyCallback = (req, res) => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: redirectUri,
    },
    headers: {
      'Authorization': 'Basic ' + clientId + ':' + sClientId,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    const accessToken = body.access_token;
    const refreshToken = body.refresh_token;

    const options = {
      url: 'https://api.spotify.com/v1/me',
      headers: {'Authorization': 'Bearer ' + accessToken},
      json: true,
    };

    request.get(options, (error, response, body) => {
      console.log(body);
    })
  });
};
