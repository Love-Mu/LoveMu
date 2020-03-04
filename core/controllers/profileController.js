const similarity = require('compute-cosine-similarity');
const User = require('../models/User');

module.exports = {
  getProfiles: (req, res, next) => {
    User.find({_id: {$ne: req.user.id}}).select('-password').exec((err, users) => {
      const currUsrMap = req.user.genres;
      const usrGenreArr = [];
      currUsrMap.forEach((val, key, map) => {
        usrGenreArr.push(key);
      });
      users.forEach((usr) => {
        const tempScore = [];
        const tempUsrScore = [];
        const checkGenreArr = [];
        const checkUsrMap = usr.genres;
        checkUsrMap.forEach((val, key, map) => {
          checkGenreArr.push(key);
        });
        checkGenreArr.concat(usrGenreArr);
        usrGenreArr.forEach((val, idx) => {
          if (!checkGenreArr.includes(val)) {
            usrGenreArr.push(val);
          }
        });
        checkGenreArr.forEach((item, idx) => {
          if (currUsrMap.has(item)) {
            tempScore.push(currUsrMap.get(item));
          } else {
            tempScore.push(0);
          }
          if (checkUsrMap.has(item)) {
            tempUsrScore.push(checkUsrMap.get(item));
          } else {
            tempUsrScore.push(0);
          }
        });
        usr.score = similarity(tempScore, tempUsrScore);
        console.log(usr.email + ' : ' + usr.score);
      });
      users.sort((a, b) => (a.score >= b.score) ? -1 : 1);
      res.json(users);
    })
  },
    getProfile: (req, res, next) => {
      const uId = req.params.id;
      // Find user based on this id and serve it
      User.findOne({_id: uId}).select('-password').exec((err, user) => {
        if (err) {
          return res.json({error: err});
        }
        if (!user) {
          return res.status(404).json({message: 'User does not exist'});
        }
        res.json(user);
      });
    },
    updateProfile: (req, res, next) => {
      const uId = req.params.id;
      // Find user and update by id
  
      res.redirect(`/profiles/${uId}`);
    }
  };
