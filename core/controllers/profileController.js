const similarity = require('compute-cosine-similarity');
const moment = require('moment');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

module.exports = {
  getProfiles: async (req, res, next) => {
    const curr = await req.user;
    const sexuality = curr.sexuality;
    // Find user based on this id and serve it
    const gender = curr.gender;
    let filters = {
      _id: {$ne: curr.id},
      gender: {$in: sexuality},
      sexuality: {$in: gender},
    };
    if (req.body.location != null) {
      filters.location = req.body.location;
    }
    User.find(filters).select('-password').exec((err, users) => {
      if (!users) { 
        return res.json({message: 'No Users Found'});
      }
      if (users.length > 1) {
        similarityGeneratorAll(curr, users).then((result) => {
          console.log("Users:", result);
          return new Promise(async (resolve, reject) => {
            const sortedArray = result.sort((a, b) => (a.score >= b.score) ? -1 : 1)
            resolve(sortedArray);
          });
        }).then((sorted) => {
          res.json(sorted);
        });
      } else {
        similarityGeneratorUser(curr, users).then(score => {
          res.json([{
            _id: users._id,
            user_name: users.user_name,
            fname: users.fname,
            sname: users.sname,
            gender: users.gender,
            location: users.location,
            bio: users.bio,
            artists: users.artists || new Map(),
            playlist: users.playlist || '',
            playlists: users.playlists || [],
            favouriteSong: users.favouriteSong || '',
            image: users.image,
            score: Math.round(score) || 0
          }]);
        });
      }
    });
  },
    getProfile: (req, res, next) => {
      const uId = req.params.id;
      const currUser = req.user;
      // Find user based on this id and serve it
      User.findOne({_id: uId}).select('-password').exec(async (err, user) => {
        if (err) {
          return res.json({error: err});
        }
        if (!user) {
          return res.status(404).json({message: 'User does not exist'});
        }
        let promises = [generateAge(user.dob ), generateSexuality(user.sexuality)]
        if (user != null) {
          promises.push(similarityGeneratorUser(currUser, user))
        }
        Promise.all(promises).then(values => {
          res.json({
            _id: user._id,
            email: user.email,
            user_name: user.user_name,
            fname: user.fname,
            sname: user.sname,
            age: values[0],
            dob: user.dob,
            sexuality: values[1],
            gender: user.gender,
            location: user.location,
            bio: user.bio,
            artists: Array.from(user.artists.values()) || new Map(),
            playlist: user.playlist || '',
            playlists: user.playlists || [],
            favouriteSong: user.favouriteSong || '',
            image: user.image,
            score: Math.round(values[2]) || 0
          });
        }).catch((err) => {console.log(err)})
      })
    },
    updateProfile: async (req, res, next) => {
      // Find user and update by id
      const id = req.user._id;
      let sexuality = [];
      if (req.body.sexuality == 'Everyone') {
        sexuality = ['Male', 'Female', 'Rather Not Say', 'Other'];
      } else {
        sexuality = [req.body.sexuality];
      }
      User.findOne({user_name: req.body.user_name}).exec((err, user) => {
        if (err) {
          return res.json({error: err});
        }
        if (user && (user._id != id)) {
          return res.status(403).json({message: 'Username already in use'});
        }
        User.findOneAndUpdate({_id: id}, {$set: {
            user_name: req.body.user_name,
            fname: req.body.fname,
            sname: req.body.sname,
            location: req.body.location,
            image: req.body.image,
            gender: req.body.gender,
            sexuality: sexuality,
            bio: req.body.bio,
            playlist: req.body.playlist,
            favouriteSong: req.body.favouriteSong,
            dob: req.body.dob || new Date(),
            complete: true}}).exec((err, usr) => {
            if (err) {
              return res.json({error: err});
            }
            if (!usr) {
              return res.status(404).json({message: 'User does not exist'});
            } else {
              return res.status(200).json({message: 'Successfully Updated!'});
            }
          });
        });
      }
    };

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

  function similarityGeneratorUser(currUser, user) {
    return new Promise(function (resolve, reject) {
      Promise.all([compareGenres(currUser, user), compareArtists(currUser, user)]).then((value) => {
        resolve((((value[0] * .8) + (value[1]) * .2)) * 100);
        }).catch((error) => { 
          resolve(0);
      });
    })
  }
  
  function similarityGeneratorAll(currUser, users) {
    return new Promise(function (resolve, reject) {
      let userArray = [];
      users.forEach(async (user) => {
        let score1 = await compareGenres(currUser, user);
        userArray.push({
          _id: user._id,
          fname: user.fname,
          sname: user.sname,
          location: user.location,
          bio: user.bio,
          image: user.image,
          score: Math.round(score1 * 100) || 0
        });
      });
      resolve(userArray);
    });
  }

  function generateAge(dob) {
    const age = new Promise(function (resolve, reject) {  
      if (dob === null) {
        reject({message: 'No DOB'});
      } else {
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms); 
        resolve(Math.abs(age_dt.getUTCFullYear() - 1970));
      }
    });
    return age;
  }
  
  function compareGenres(usr1, usr2) {
    return new Promise(function (resolve, reject) {
      let keys = [];
      let usr1Score = [];
      let usr2Score = [];
      usr1.genres.forEach((value, key, map) => {
        usr1Score.push(value);
        if (usr2.genres.has(key)) {
          usr2Score.push(value);
        } else {
          usr2Score.push(0);
        }
      });
      usr2.genres.forEach((value, key, map) => {
        if (!usr1.genres.has(key)) {
          usr1Score.push(0);
          usr2Score.push(value);
        }
      })
      const score = similarity(usr1Score, usr2Score);
      resolve(score);
    });
  }

  function compareArtists(usr1, usr2) {
    return new Promise((resolve, reject) => {
      let usr1Score = [];
      let usr2Score = [];
      usr1.artists.forEach((value, key, map) => {
        usr1Score.push(1);
        if (usr2.artists.has(key)) {
          usr2Score.push(1);
        } else {
          usr2Score.push(0);
        }
      });
      usr2.artists.forEach((value, key, map) => {
        if (!usr1.artists.has(key)) {
          usr1Score.push(0);
          usr2Score.push(1);
        }
      })
      const score = similarity(usr1Score, usr2Score);
      resolve(score);
    });
  }
 