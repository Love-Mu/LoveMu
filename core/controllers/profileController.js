const similarity = require('compute-cosine-similarity');

const User = require('../models/User');

module.exports = {
  getProfiles: (req, res, next) => {
    /* Insert DB call to return all profiles and store in array,
    ensure we don't send password, can be used to retrieve
    sexuality/gender in future*/
    // Current user _id can be retrieved with req.session.passport.user
    console.log(req.user);
    const users = {};
    const currUser = User.genres;
    const usrGenreArr = {};
    const usrScore = {};
    currUser.forEach((val, key, map) => {
      usrGenreArr.push(key);
      usrScore.push(val);
    });
    users.forEach((usr) => {
      const tempScore = usrScore;
      const tempUsrScore = {};
      const currGenres = usr.genres;
      usrGenreArr.forEach((val) => {
        if (!usr.has(val)) {
          tempUsrScore.push(0);
        } else {
          tempUsrScore.push(currGenres.get(val));
        }
      });
      currGenres.forEach((val, key, map) => {
        if (!usrGenreArr.includes(key)) {
          tempScore.push(0);
          tempUsrScore.push(currGenres.get(key));
        }
      });
      usr.score = similarity(tempScore, tempUsrScore);
    });
    res.json(users.sort((a, b) => (a.score >= b.score) ? 1 : -1));
  },
  getProfile: (req, res, next) => {
    const uId = req.params.id;
    // Find user based on this idea and serve it
    res.json(usr);
  },
};
