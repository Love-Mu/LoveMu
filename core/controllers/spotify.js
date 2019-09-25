const request = require('request');
const queryString = require('query-string');
const Buffer = require('safer-buffer').Buffer;

const clientId = '7cf1414999bf4006b28cb368b2d45693';
const sClientId = process.env.SECRET;
const redirectUri = 'http://lovemu.compsoc.ie:8001/api/spotify/callback';

exports.Auth = (req, res) => {
  const scope = 'user-top-read';
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`);
};

exports.Callback = (req, res) => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: redirectUri,
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + sClientId)).toString('base64'),
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    const accessToken = body.access_token;
    const refreshToken = body.refresh_token;

    const options = {
      url: 'https://api.spotify.com/v1/me/top/artists',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
      json: true,
    };

    request.get(options, (error, response, body) => {
      console.log(body);
      res.json(body);
    });
  });
};

exports.Refresh = (req, res) => {
  const refreshToken = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(clientId + 'retrieveArtists?accessToken=BQAqu7qxeFkgJWci9khLBZkOXxREvX6IyCA6zaHSAE5NIhVGGi4wm6GYnYlldxu5KIBrDUv7aefOKqo0ygaR8mDPvPu173ewH-lYI7hNvGaJh3-TK4PDE0hEXLunT7Hvb3BevgXZrydM2GvI7Wb59mQ_ZZsO:' + sClientId)).toString('base64'),
    },
    form: {
      grantType: 'refresh_token',
      refresh_token: refreshToken,
    },
    json: true,
  };

  request.post(authOptions, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const accessToken = body.access_token;
      res.send(accessToken);
    }
  });
};

exports.RetrieveArtists = (req, res) => {
  const options = {
    url: `https://api.spotify.com/v1/me/top/artists`,
    headers: {
      'Authorization': 'Bearer ' +  req.accessToken,
    },
    artists: 50,
    json: true,
  };
  request.get(options, (err, response, body) => {
    res.json(body);
  });
};
