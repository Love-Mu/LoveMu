const similarity = require('compute-cosine-similarity');
const moment = require('moment');

const User = require('../models/User');

module.exports = {
  getProfiles: async (req, res, next) => {
    const curr = await req.user;
    const sexuality = curr.sexuality;
    const gender = curr.gender;
    let filters = {
      _id: {$ne: curr.id},
      gender: {$in: sexuality},
      sexuality: {$in: gender}
    };
    if (req.body.location != null) {
      filters.location = req.body.location;
    }
    const sortOrder = req.body.score || 1;
    /*const pageNum = req.body.page || 1;
    const skips = 12 * (pageNum - 1)*/
    User.find(filters).select('-password -refresh_token -access_token')/*.skip(skips).limit(12)*/.exec((err, users) => {
      if (!users) { 
        return res.json({message: 'No Users Found'});
      }
      similarityGenerator(req.user, users, sortOrder).then((result) => {
        return res.json(result);
      });
    });
  },  
    getProfile: async (req, res, next) => {
      const uId = req.params.id;
      const currUser = await req.user;
      // Find user based on this id and serve it
      User.findOne({_id: uId}).select('-password').exec(async (err, user) => {
        if (err) {
          return res.json({error: err});
        }
        if (!user) {
          return res.status(404).json({message: 'User does not exist'});
        }
        Promise.all([generateAge(user.dob), generateSexuality(user.sexuality), similarityGeneratorUser(currUser, user, 1)]).then(values => {
          res.json({
            _id: user._id,
            user_name: user.user_name,
            fname: user.fname,
            sname: user.sname,
            age: values[0],
            sexuality: values[1],
            gender: user.gender,
            location: user.location,
            bio: user.bio,
            artists: user.artists || [],
            playlist: user.playlist || '',
            playlists: user.playlists || [],
            favouriteSong: user.favouriteSong || '',
            image: user.image,
            score: Math.round(values[2].score * 100)
          });
        })
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
        } else {
          return res.status(200).json({message: 'Successfully Updated!'});
        }
      });
    }
  };

  function similarityGenerator(currUsr, users, sortOrder) {
    return new Promise((resolve, reject) => {
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
      resolve(users.sort((a, b) => (a.score >= b.score) ? -1 : 1));
    });
  }

  function similarityGeneratorUser(currUsr, user, sortOrder) {
    return new Promise(function (resolve, reject) {
      const currUsrMap = currUsr.genres;
      const usrGenreArr = [];
      currUsrMap.forEach((val, key, map) => {
        usrGenreArr.push(key);
      });
      const tempScore = [];
      const tempUsrScore = [];
      const checkGenreArr = [];
      const checkUsrMap = user.genres;
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
      user.score = similarity(tempScore, tempUsrScore);
      resolve(user);
    });
  }
 
  function generateSexuality(sexuality) {
    return new Promise((resolve, reject) => {
      if (sexuality.length === 4) {
        resolve('Everyone');
      }
      else if (sexuality[0] == ['Male']) {
        resolve('Men');
      }
      else if (sexuality[0] == ['Female']) {
        resolve('Women');
      } else {
        reject({message: 'Error Generating Sexuality'});
      }
    });
  }
  
  function generateAge(dob) {
    const age = new Promise(function (resolve, reject) {  
      if (dob === null) {
        reject({message: 'No DOB'});
      }
      const diff_ms = Date.now() - dob.getTime();
      const age_dt = new Date(diff_ms); 
      resolve(Math.abs(age_dt.getUTCFullYear() - 1970));
    });
    return age;
  }