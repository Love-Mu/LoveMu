const request = require('request');
const queryString = require('query-string');
const Buffer = require('safer-buffer').Buffer;

const clientId = '7cf1414999bf4006b28cb368b2d45693';
const sClientId = process.env.SECRET;
const redirectUri = 'http://lovemu.compsoc.ie:8001/api/spotify/callback';

exports.Auth = (req, res) => {
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`);
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
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      json: true,
    };

    request.get(options, (error, response, body) => {
      console.log(body);
    });

    res.redirect('/#' +
      queryString.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }));
  });
};

exports.Refresh = (req, res) => {
  const refreshToken = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + sClientId)).toString('base64'),
    },
    form: {
      grantType: 'refresh_token',
      refresh_token: refreshToken,
    },
    json: true,
  };

  request.post(authOptions, (err, response, body) => {
    if (!error && response.statusCode === 200) {
      const accessToken = body.access_token;
      res.send({
        'access_token': accessToken,
      });
    }
  });

  res.redirect('/');
};
