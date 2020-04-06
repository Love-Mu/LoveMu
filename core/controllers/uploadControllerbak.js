const fs = require('fs-extra');
const User = require('../models/User');

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
   
exports.upload = (req, res) => {
  if(!req.file){
    return res.status(200).json({message: "File is not an image"});
  }
  return res.status(200).json({filename: req.file.filename, cookie:req.cookies.fileCookie});
};

exports.save = (req, res) =>{
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
};

exports.reupload = (req,res) =>{
  if(!req.file){
    return res.status(200).json({message: "File is not an image"});
  }
  return res.status(200).json({newFile: req.file.filename});
};

exports.update = (req,res) =>{
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
};