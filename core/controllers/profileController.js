const similarity = require('compute-cosine-similarity');

const User = require('../models/User');

module.exports = {
  getProfiles: (req, res, next) => {
    /* Insert DB call to return all profiles and store in array,
    ensure we don't send password, can be used to retrieve
    sexuality/gender in future*/
    const users = {};
    const currUser = User.genres;
    const usrGenreArr = {};
    const usrScore = {};
    currUser.forEach((val, key, map) => {
      usrGenreArr.push(key);
      usrScore.push(val);
    });
    users.forEach((usr) => {
      const tempMainUsrScore = usrScore;
      const tempScore = {};
      usrGenreArr.forEach((val) => {
        if (!usr.has(val)) {
          tempScore.push(0);
        } else {
          tempScore.push(usr.genres.get(val));
        }
      });
      usr.genres.forEach((val, key, map) => {
        if (!usrGenreArr.includes(key)) {
          tempMainUsrScore.push(0);
          tempScore.push(usr.genres.get(key));
        }
      });
      usr.score = similarity(tempMainUsrScore, tempScore);
    });

    res.json(users.sort((a, b) => (a.score >= b.score) ? 1 : -1));
  },
  getProfile: (req, res, next) => {
    const uId = req.params.id;
    // Find user based on this idea and serve it
    res.json(usr);
  },
};
