const express = require('express');
const router = express.Router();
const multer  = require('multer')
const fs = require('fs-extra');
const path = require('path');
const User = require('../models/User');

var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = './temp/'+req.cookies.tempuser+'/';
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
var storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = './temp/'+req.user.id+'/';
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
      console.log(curPath);
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
   
var upload = multer({ storage: storage1 })
var update = multer({ storage: storage2 })

router.post('/upload', upload.single('file'), function (req, res, next) {
    return res.status(200).json({filename: req.file.filename, cookie:req.cookies.tempuser});
});

router.post('/save', (req, res) =>{
  if(req.body.filename != null && req.body.filename != undefined && req.body.filename != "default.png"){
    fs.copy('./temp/'+req.body.cookie+'/'+req.body.filename, './public/'+req.body.filename, err =>{
      if (err) return console.error(err);
      console.log('1 success!');
      fs.copy('./temp/'+req.body.cookie+'/'+req.body.filename, './uploads/'+req.body.filename, err =>{
        if (err) return console.error(err);
        console.log('2 success!');
        deleteFolderRecursive('./temp/'+req.body.cookie);
      });
    });
  }
  return res.status(200).json({message: "done"});
});

router.post('/reupload', update.single('file') (req,res) =>{
  return res.status(200).json({newFile: req.file.filename, oldFile: req.user.image});
});

router.post('/update', (req,res) =>{
  //first remove old file from public and uploads
  fs.unlinkSync('./public/' + req.body.oldFile);
  fs.unlinkSync('./uploads/' + req.body.oldFile);
  //now transfer new file and delete from temp
  fs.copy('./temp/'+req.user.id+'/'+req.body.newFile, './public/'+req.body.newFile, err =>{
    if (err) return console.error(err);
    console.log('1 success!');
    fs.copy('./temp/'+req.user.id+'/'+req.body.newFile, './uploads/'+req.body.newFile, err =>{
      if (err) return console.error(err);
      console.log('2 success!');
      deleteFolderRecursive('./temp/'+req.user.id);
    });
  });

});

module.exports = router;