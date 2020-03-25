const similarity = require('compute-cosine-similarity');
const moment = require('moment');

const User = require('../models/User');

module.exports = {
  getProfiles:  (req, res, next) => {
    let curr = req.user;
    let sexuality = curr.sexuality;
    let gender = curr.gender;
    User.find({_id: {$ne: curr.id}, gender: {$in: sexuality}, sexuality: {$in: gender}}).select('-password -refresh_token -access_token').exec((err, users) => {
      res.json(similarityGenerator(req.user, users));
    });
  },
    getProfile: (req, res, next) => {
      const uId = req.params.id;
      // Find user based on this id and serve it

      User.findOne({_id: uId}).select('-password').exec(async (err, user) => {
        if (err) {
          return res.json({error: err});
        }
        if (!user) {
          return res.status(404).json({message: 'User does not exist'});
        }
        user.sexuality = await generateSexuality(user.sexuality)
        res.json(user);
      })
    },
    updateProfile: async (req, res, next) => {
      // Find user and update by id
      const id = req.user._id;
      if (req.user_name !== req.body.user_name) {
        User.findOne({user_name: req.body.user_name}).exec((err, user) => {
          if (err) {
            return res.json({error: err});
          }
          if (user) {
            return res.status(403).json({message: 'Username already in use'});
          }
        });
      }
      let sexuality = [];
      if (req.body.sexuality == 'Everyone') {
        sexuality = ['Male', 'Female', 'Rather Not Say', 'Other'];
      } else {
        sexuality = [req.body.sexuality];
      }
      User.findOneAndUpdate({_id: id}, {$set: {
        user_name: req.body.user_name,
        fname: req.body.fname,
        sname: req.body.sname,
        dob: req.body.dob,
        location: req.body.location,
        image: req.body.image,
        gender: req.body.gender,
        sexuality: sexuality,
        bio: req.body.bio,
        complete: true}}).exec((err, user) => {
        if (err) {
          return res.json({error: err});
        }
        if (!user) {
          return res.status(404).json({message: 'User does not exist'});
        }
        return res.status(200).json({message: 'Successfully Updated!'});
      });
    }
  };

  function similarityGenerator(currUsr, users) {
      const currUsrMap = currUsr.genres;
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
      return users.sort((a, b) => (a.score >= b.score) ? -1 : 1);
  }

  function generateSexuality(sexuality) {
    return new Promise((resolve, reject) => {
        if (sexuality === ['Male']) {
          resolve('Men');
        }
        else if (sexuality === ['Female']) {
          resolve('Women');
        } else {
          resolve('Everyone');
        }
      });
  }