const similarity = require('compute-cosine-similarity');
const User = require('../models/User');

module.exports = {
  getProfiles: (req, res, next) => {
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
      User.findOne({_id: uId}).select('-password').exec((err, user) => {
        if (err) {
          return res.json({error: err});
        }
        if (!user) {
          return res.status(404).json({message: 'User does not exist'});
        }
        user.age = user.Age;
        res.json(user);
      });
    },
    updateProfile: (req, res, next) => {
      // Find user and update by id
      const id = req.user._id;
      const params = {
        user_name: req.body.user_name,
        fname: req.body.fname,
        sname: req.body.sname,
        dob: req.body.dob,
        location: req.body.location,
        image: req.body.image,
        gender: req.body.gender
      }
        User.findOneAndUpdate({_id: id}, {$set: {params}}).exec((err, user) => {
          if (err) {
            return res.json({error: err});
          }
          if (!user) {
            return res.status(404).json({message: 'User does not exist'});
          }
          if (user.user_name !== req.body.user_name) {
            return res.status(403).json({message: 'user_name already in use'});
          }
          res.status(200).json({message: 'Successfully Updated!'});
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