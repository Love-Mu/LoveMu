const express = require('express');
const router = express.Router();
const multer  = require('multer')
const fs = require('fs-extra');
const path = require('path');
const User = require('../models/User');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let path = './temp/'+req.cookies.io+'/';
      fs.mkdirsSync(path);
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })
   
  var upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), function (req, res, next) {
  return res.status(200).json({filename: req.file.filename, cookie:req.cookies.io});
});

router.post('/save', (req, res) =>{
  if(req.body.filename != null && req.body.filename != undefined && req.body.filename != "default.png"){
    fs.copy('./temp/'+req.body.cookie+'/'+req.body.filename, './public/'+req.body.filename, err =>{
      if (err) return console.error(err);
      console.log('1 success!');
    });
    fs.copy('./temp/'+req.body.cookie+'/'+req.body.filename, './uploads/'+req.body.filename, err =>{
      if (err) return console.error(err);
      console.log('2 success!');
    });
    var deleteFolderRecursive = function(curPath) {
      if( fs.existsSync(curPath) ) {
        fs.readdirSync(curPath).forEach(function(file,index){
          var curPath = curPath+ "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(curPath);
      }
    };
    deleteFolderRecursive('./temp/'+req.body.cookie);
  }
  return res.status(200).json({message: "done"});
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
          fs.copy('./temp/'+usr.image, './public/'+usr.image, err =>{
            if (err) return console.error(err);
            console.log('success!');
          });
        }
      }
      return res.status(200).json({message: "HEyo"});
    }
  });
});

router.post('/clear', (req,res) =>{
  
});


module.exports = router;