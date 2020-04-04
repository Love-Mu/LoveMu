const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer  = require('multer')
const fs = require('fs-extra');
const path = require('path');
const User = require('../models/User');

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
var deleteFolderRecursive = function(curPath) {
  if( fs.existsSync(curPath) ) {
    fs.readdirSync(curPath).forEach(function(file,index){
      var nextPath = curPath + "/" + file;
      if(fs.lstatSync(nextPath).isDirectory()) { // recurse
        deleteFolderRecursive(nextPath);
      } else { // delete file
        fs.unlinkSync(nextPath);
      }
    });
    fs.rmdirSync(curPath);
    console.log("3 success!");
  }
};
   
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

router.post('/upload',  upload.single('file'), function (req, res, next) {
  if(!req.file){
    return res.status(200).json({message: "File is not an image"});
  }
  return res.status(200).json({filename: req.file.filename, cookie:req.cookies.fileCookie});
});

router.post('/save', (req, res) =>{
  if(req.body.filename != null && req.body.filename != undefined && req.body.filename != "default.png"){
    fs.copy('./public/temp/'+req.body.cookie+'/'+req.body.filename, './public/'+req.body.filename, err =>{
      if (err) return console.error(err);
      console.log('1 success!');
      fs.copy('./public/temp/'+req.body.cookie+'/'+req.body.filename, './uploads/'+req.body.filename, err =>{
        if (err) return console.error(err);
        console.log('2 success!');
        deleteFolderRecursive('./public/temp/'+req.body.cookie);
      });
    });
  }
  return res.status(200).json({message: "done"});
});

router.post('/reupload', passport.authenticate('jwt', {session: false}), update.single('file'), (req,res) =>{
  if(!req.file){
    return res.status(200).json({message: "File is not an image"});
  }
  return res.status(200).json({newFile: req.file.filename});
});

router.post('/update', passport.authenticate('jwt', {session: false}),(req,res) =>{
  if (req.body.oldFile == req.body.newFile){
    return res.status(200).json({message: "Old and new file the same"});
  }
  //first remove old file from public and uploads (if not default)
  if(req.body.oldFile != "default.png"){
    if(fs.existsSync('./public/' + req.body.oldFile) ){
      fs.unlinkSync('./public/' + req.body.oldFile);
    }
    if(fs.existsSync('./uploads/' + req.body.oldFile)){
      fs.unlinkSync('./uploads/' + req.body.oldFile);
    }
  }
  
  //now transfer new file and delete from temp
  fs.copy('./public/temp/'+req.user.id+'/'+req.body.newFile, './public/'+req.body.newFile, err =>{
    if (err) return console.error(err);
    console.log('1 success!');
    fs.copy('./public/temp/'+req.user.id+'/'+req.body.newFile, './uploads/'+req.body.newFile, err =>{
      if (err) return console.error(err);
      console.log('2 success!');
      deleteFolderRecursive('./public/temp/'+req.user.id);
    });
  });
  return res.status(200).json({message: "done"});
});

module.exports = router;