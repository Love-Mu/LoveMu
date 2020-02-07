const similarity = require('compute-cosine-similarity');
const { recommender } = require('../config/recommender');
const User = require('../models/User');

module.exports = {
  getProfiles: (req, res, next) => {
    User.find({_id: {$ne: req.user.id}}).select('-password').exec((err, users) => {
        res.json(recommender(err, users));
      });
    },
    getProfile: (req, res, next) => {
      const uId = req.params.id;
      // Find user based on this id and serve it
      User.findOne({_id: uId}).select('-password').exec((err, user) => {
        if (err) {
          res.json({error: err});
        }
        if (!user) {
          res.json({message: 'User does not exist'});
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