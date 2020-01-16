const User = require('../models/User');

module.exports = {
  getProfiles: (req, res, next) => {
    /* Insert DB call to return all profiles and store in array,
    ensure we don't send password, req.session.uId can be used to retrieve
    sexuality/gender in future*/

    res.json(usrs);
  },
  getProfile: (req, res, next) => {
    const uId = req.params.id;
    // Find user based on this idea and serve it
    res.json(usr);
  },
};
