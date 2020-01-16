const jwt = require('jsonwebtoken');

module.exports = {
  authMiddleware: (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          res.json({
            success: false,
            message: 'Token is not valid',
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.json({success: false, message: 'Token is not supplied'});
    }
  },
};
