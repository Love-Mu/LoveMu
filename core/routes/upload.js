const express = require('express');
const router = express.Router();
var multer  = require('multer')
let fs = require('fs-extra');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let path = `./uploads/`;
      fs.mkdirsSync(path);
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname +"-" + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), function (req, res, next) {
    console.log("There you go");
    return res.status(200).json({filepath: req.file.path});
})

module.exports = router;