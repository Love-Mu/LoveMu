const express = require('express');
const passport = require('passport');
const multer  = require('multer');
const fs = require('fs-extra');
const path = require('path');

var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = './public/temp/'+req.cookies.fileCookie+'/';
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
var storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = './public/temp/'+req.user.id+'/';
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({ storage: storage1, 
  fileFilter: (req, file, cb) => {
    if (
      !file.mimetype.includes("jpeg") &&
      !file.mimetype.includes("jpg") &&
      !file.mimetype.includes("png") &&
      !file.mimetype.includes("gif")
    ) {
      return cb(null, false, new Error("Only images are allowed"));
    }
    cb(null, true);
  } 
})
var update = multer({ storage: storage2, 
  fileFilter: (req, file, cb) => {
    if (
      !file.mimetype.includes("jpeg") &&
      !file.mimetype.includes("jpg") &&
      !file.mimetype.includes("png") &&
      !file.mimetype.includes("gif")
    ) {
      return cb(null, false, new Error("Only images are allowed"));
    }
    cb(null, true);
  } 
})


const Upload = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload',  upload.single('file'), Upload.upload);

router.post('/save', Upload.save);

router.post('/reupload',  passport.authenticate('jwt', {session: false}), update.single('file'), Upload.reupload);

router.post('/update', passport.authenticate('jwt', {session: false}), Upload.update);
module.exports = router;