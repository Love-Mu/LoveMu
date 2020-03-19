const express = require('express');
const socket_io = require('socket.io')

const Message = require('../models/Message');
const { userValidationRules, validate, ensureAuthenticated } = require('../config/validator');

const io = socket_io();
const router = express.Router();

// Router /retrieve not done
/*router.get('/retrieve', ensureAuthenticated, (req, res) => {
    Message.findAll({'$or':[{'$and':[{'sender':req.user._id},{'recipient' : req.body._id},{'sender':req.body._id},{'recipient' : req.user._id}]}]}).populate('sender').populate('recipient').exec((err, msg) => {
      if (err) {
        return res.status(404).json(err);
      }
      else{
        console.log(msg);
        return res.status(200).json({message: "Got this far!!!"});
      }
    })
});*/

router.post('/retrieve', ensureAuthenticated, (req, res) => {
  Message.find({ sender: req.user._id, recipient: req.body.recipient}, function (err, msgs) {
    if (err) {
      throw err;
      return res.status(404).json(err);
    } else {
      return res.status(200).json({msgs});
    }
  });
});

// Router /send post done
router.post('/send', ensureAuthenticated, (req, res) => {
    let msg = new Message({
        sender: req.user._id,
        recipient: req.body.recipient,
        body: req.body.body
    });
    msg.save((err) => {
      if (err) {
        return res.status(404).json(err);
      }
      req.login(msg, (err) => {
        if (err) {
          return res.status(404).json(err);
        }
        return res.status(200).json({message: "Message Successfully Saved to DB", sender: msg.sender, recipient: msg.recipient});
        })
    });
});

module.exports = router;