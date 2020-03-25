const express = require('express');
const router = express.Router();
const multer  = require('multer')
const fs = require('fs-extra');
const path = require('path');
const User = require('../models/User');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let path = `./uploads/`;
      fs.mkdirsSync(path);
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })
   
  var upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), function (req, res, next) {
    return res.status(200).json({filename: req.file.filename});
});

router.post('/move', (req,res) =>{
  User.find( {} , {image:1}).exec((err, users) => {
    if (err) {
      throw err;
      return res.status(404).json(err);
    } else {
      for(var i = 0; i < users.length; i++) {
        var usr = users[i];
        if(usr.image.startsWith("file-")){
          fs.copy('./uploads/'+usr.image, './dist/client/'+usr.image, err =>{
            if (err) return console.error(err);
            console.log('success!');
          });
        }
      }
      return res.status(200).json({message: "HEyo"});
    }
  });
});


module.exports = router;