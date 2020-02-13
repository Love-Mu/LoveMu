const express = require('express');

const Profile = require('../controllers/profileController');

const router = express.Router();

router.get('/', ensureAuthenticated, Profile.getProfiles);

router.get('/:id', ensureAuthenticated, Profile.getProfile);

router.put('/:id', ensureAuthenticated, Profile.updateProfile);

module.exports = router;

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('Unauthenticated');
  res.send('Unauthenticated');
  
}
