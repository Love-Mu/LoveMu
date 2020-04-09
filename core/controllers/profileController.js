const similarity = require('compute-cosine-similarity');
const moment = require('moment');
const {
  check,
  validationResult
} = require('express-validator');

const User = require('../models/User');

module.exports = {
  getProfiles: async (req, res, next) => {
    const curr = req.user;
    const sexuality = curr.sexuality;
    const gender = curr.gender;
    const blocked = curr.blocked;
    let filters = {
      _id: {
        $ne: curr._id,
        $nin: curr.blocked
      },
      gender: {
        $in: sexuality
      },
      sexuality: {
        $in: gender
      },
      blocked: {
        $ne: curr.id
      }
    };
    if (req.body.location != null) {
      filters.location = req.body.location;
    }
    User.find(filters).select('-password').exec((err, users) => {
      if (err) {
        return res.status(500).json({
          error: err
        })
      }
      if (users.length == 0) {
        return res.status(200).json({
          message: 'No Users Found'
        });
      }
      if (users.length > 1) {
        similarityGeneratorAll(curr, users).then((result) => {
          return new Promise((resolve, reject) => {
            const sortedArray = result.sort((a, b) => (a.score >= b.score) ? -1 : 1)
            resolve(sortedArray);
          });
        }).then((sorted) => {
          res.json(sorted);
        }).catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      } else {
        res.status(200).json([{
          _id: users[0]._id,
          fname: users[0].fname,
          sname: users[0].sname,
          bio: users[0].bio,
          image: users[0].image
        }]);
      }
    });
  },
  getProfile: (req, res, next) => {
    const uId = req.params.id;
    const currUser = req.user;
    // Find user based on this id and serve it
    User.findOne({
      _id: uId
    }).select('-password').exec(async (err, user) => {
      if (err) {
        return res.json({
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'User does not exist'
        });
      }
      let promises = [generateAge(user.dob), generateSexuality(user.sexuality)]
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
          artists: values[2].artists,
          overlappingArtists: values[2].overlappingArtists,
          image: user.image,
          playlist: user.playlist || '',
          playlists: user.playlists || [],
          favouriteSong: user.favouriteSong || '',
          score: Math.round(values[2].score) || 0,
          blocked: user.blocked,
          blockedArtists: Array.from(user.blockedArtists.values())
        });
      }).catch((err) => {
        console.log(err);
        res.json(user);
      })
    })
  },
  updateProfile: async (req, res, next) => {
    // Find user and update by id
    const id = req.user._id;
    let sexuality = [];
    User.findOne({
      user_name: req.body.user_name
    }).exec(async (err, user) => {
      if (err) {
        return res.json({
          error: err
        });
      }
      if (user && ((user._id).toString() != (req.user._id).toString())) {
        return res.status(403).json({
          message: 'Username already in use'
        });
      }
      const parameters = {
        complete: true
      };
      if (req.body.user_name != '' && req.body.user_name != null) {
        parameters.user_name = req.body.user_name;
      }
      if (req.body.fname != '' && req.body.fname != null) {
        parameters.fname = req.body.fname;
      }
      if (req.body.sname != '' && req.body.sname != null) {
        parameters.sname = req.body.sname;
      }
      if (req.body.location != '' && req.body.location != null) {
        parameters.location = req.body.location;
      }
      if (req.body.gender != '' && req.body.gender != null) {
        parameters.gender = req.body.gender;
      }
      if (req.body.blocked != '' && req.body.blocked != null) {
        parameters.blocked = req.body.blocked;
      }
      if (req.body.image != '' && req.body.image != null) {
        parameters.image = req.body.image;
      }
      if (req.body.sexuality != '' && req.body.sexuality != null) {
        if (req.body.sexuality == 'Everyone') {
          parameters.sexuality = ['Male', 'Female', 'Rather Not Say', 'Other'];
        } else {
          parameters.sexuality = [req.body.sexuality];
        }
      }
      if (req.body.bio != '' && req.body.bio != null) {
        parameters.bio = req.body.bio;
      }
      if (req.body.playlist != '' && req.body.playlist != null) {
        parameters.playlist = req.body.playlist;
      }
      if (req.body.favouriteSong != '' && req.body.favouriteSong != null) {
        parameters.favouriteSong = req.body.favouriteSong;
      }
      if (req.body.dob != '' && req.body.dob != null) {
        parameters.dob = req.body.dob;
      }
      User.findOneAndUpdate({
        _id: req.user._id
      }, {
        $set: parameters
      }, {
        returnNewDocument: true
      }).exec((err, usr) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: err
          });
        }
        if (!usr) {
          return res.status(404).json({
            message: 'User Does Not Exist'
          });
        } else {
          return res.status(200).json({
            message: 'Successful Update!'
          });
        }
      });
    });
  },
  block: (req, res, next) => {
    // Find user and update by id
    const blockId = req.params.id;
    User.findOne({
      _id: req.user._id
    }).exec((err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          error: 'User Does Not Exist'
        });
      }
      User.findOneAndUpdate({
        _id: req.user._id
      }, {
        $push: {
          blocked: blockId
        }
      }).exec((err, user) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: err
          });
        }
        return res.status(200).json({
          message: 'Successfully Blocked User'
        });
      });
    });
  },
  unblock: (req, res, next) => {
    // Find user and update by id
    const blockId = req.params.id;

    User.findOneAndUpdate({
      _id: req.user._id
    }, {
      $pull: {
        blocked: blockId
      }
    }).exec((err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err
        });
      }
      return res.status(200).json({
        message: 'Successfully Unblocked User'
      });
    });
  },
  removeArtist: (req, res, next) => {
    if (!req.body.artist) {
      return res.status(400).json({
        error: "Artist Not Specified"
      })
    }
    User.findOne({
      _id: req.user._id
    }).exec((err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'User Does Not Exist'
        });
      }
      const artists = user.artists;
      const blockedArtists = user.blockedArtists;
      artists.delete(req.body.artist.id);
      blockedArtists.set(req.body.artist.id, req.body.artist);
      User.findOneAndUpdate({_id: req.user._id}, {$set: {artists: artists, blockedArtists: blockedArtists}}).exec((err, usr) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: err
          });
        }
        return res.status(200).json({
          message: 'Removed Artist',
          artists: Array.from(artists.values()),
          blockedArtists: Array.from(blockedArtists.values())
        });
      })
    });
  },
  addArtist: (req, res, next) => {
    if (req.body.artist == {} || req.body.artist == null) {
      return res.status(400).json({
        error: "Artist Not Specified"
      })
    }
    const artists = req.user.artists;
    const blockedArtists = req.user.blockedArtists;
    if (artists.has(req.body.artist.id)) {
      return res.status(500).json({message: "Artist Already Present"});
    }
    artists.set(req.body.artist.id, req.body.artist);
    blockedArtists.delete(req.body.artist.id);
    User.findOneAndUpdate({
      _id: req.user.id
    }, {
      $set: {
        artists: artists,
        blockedArtists: blockedArtists
      }
    }).exec((err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err
        });
      }
      return res.status(200).json({
        message: "Artist Added",
        artists: Array.from(artists.values()),
        blockedArtists: Array.from(blockedArtists.values())
      });
    });
  }
};

function generateSexuality(sexuality) {
  return new Promise((resolve, reject) => {
    if (sexuality.length === 4) {
      resolve('Everyone');
    } else if (sexuality[0] == ['Male']) {
      resolve('Men');
    } else if (sexuality[0] == ['Female']) {
      resolve('Women');
    } else {
      reject({
        message: 'Error Generating Sexuality'
      });
    }
  });
}

function similarityGeneratorUser(currUser, user) {
  return new Promise(function (resolve, reject) {
    Promise.all([compareGenres(currUser, user), compareArtists(currUser, user)]).then((value) => {
      resolve({
        score: (value[0] * 100),
        overlappingArtists: value[1].overlappingArtists,
        artists: value[1].artists
      });
    }).catch((error) => {
      resolve({
        score: 0,
        overlappingArtists: new Map(),
        artists: new Map()
      })
    });
  })
}

function similarityGeneratorAll(currUser, users) {
  return new Promise(function (resolve, reject) {
    let userArray = [];
    users.forEach((user) => {
      compareGenres(currUser, user).then((score) => {
        if (score != null) {
          console.log("Score: " + score);
        }
        userArray.push({
          _id: user._id,
          fname: user.fname,
          sname: user.sname,
          location: user.location,
          bio: user.bio,
          image: user.image,
          score: Math.round(score * 100) || 0
        });
      }).catch((err) => {
        userArray.push({
          _id: user._id,
          fname: user.fname,
          sname: user.sname,
          location: user.location,
          bio: user.bio,
          image: user.image,
          score: Math.round(score * 100) || 0
        });
      });
    });
    resolve(userArray);
  });
}

function generateAge(dob) {
  const age = new Promise(function (resolve, reject) {
    if (dob === null) {
      reject({
        message: 'No DOB'
      });
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
    if (usr1.genres == null || usr2.genres == null) {
      reject("Genres are Non-Existant")
    }
    if (usr1._id.toString() == usr2._id.toString()) {
      resolve({
        score: 100
      });
    }
    usr1.genres.forEach((value, key, map) => {
      usr1Score.push(value);
      if (usr2.genres.has(key)) {
        usr2Score.push(usr2.genres.get(key));
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
    let overlap = [];
    let artists = [];
    if (usr1._id.toString() == usr2._id.toString()) {
      resolve({
        overlappingArtists: [],
        artists: Array.from(usr1.artists.values())
      })
    } else {
      usr1.artists.forEach((value, key, map) => {
        if (usr2.artists.has(key)) {
          overlap.push(value);
        }
      });
      usr2.artists.forEach((value, key, map) => {
        if (!usr1.artists.has(key)) {
          artists.push(value);
        }
      })
      resolve({
        overlappingArtists: overlap,
        artists: artists
      });
    }
  });
}