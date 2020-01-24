const similarity = require('compute-cosine-similarity');

const User = require('../models/User');

module.exports = {
  getProfiles: (req, res, next) => {
    /* Insert DB call to return all profiles and store in array,
    ensure we don't send password, can be used to retrieve
    sexuality/gender in future*/
    // Current user _id can be retrieved with req.user
    User.find({_id: {$ne: req.user.id}}).exec((err, users) => {
      const currUser = req.user.genres;
      const usrGenreArr = [];
      const usrScore = [];
      currUser.forEach((val, key, map) => {
        usrGenreArr.push(key);
        usrScore.push(val);
      });
      users.forEach((usr) => {
        const tempScore = usrScore;
        const tempUsrScore = [];
        const currGenres = usr.genres;
        usrGenreArr.forEach((val) => {
          if (!currGenres.has(val)) {
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
        console.log(usr.score);
      });
      res.json(users.sort((a, b) => (a.score >= b.score) ? 1 : -1));
    });
  },
  getProfile: (req, res, next) => {
    const uId = req.params.id;
    // Find user based on this id and serve it
    User.findOne({_id: uId}).exec((err, user) => {
      if (err) {
        return res.json({error: err});
      }
      if (!user) {
        return res.json({message: 'User does not exist'});
      }
      res.json(user);
    });
  },
};
