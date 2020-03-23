const express = require('express');
const socket_io = require('socket.io')
const passport = require('passport');
const Message = require('../models/Message');
const { messageValidationRules, validate, isAuthed } = require('../config/validator');

const io = socket_io();
const router = express.Router();

router.get('/retrieve/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Message.find({$or:[{ sender: req.user._id, recipient: req.params.id},{sender: req.params.id, recipient: req.user._id}]}).sort({'created_at':-1}).limit(10).exec((err, messages) => {
    if (err) {
      throw err;
      return res.status(404).json(err);
    } else {
      return res.status(200).json(messages);
    }
  });
});

router.post('/send', /*messageValidationRules(), validate,*/ passport.authenticate('jwt', {session: false}), (req, res) => {
    let message = new Message({
        sender: req.user._id,
        recipient: req.body.recipient,
        body: req.body.body
    });
    console.log(req.body.body);
    if(message.body == null || message.body == ''){
      console.log("This message is blank");
      return res.status(403).json({message: "Blank message", sender: message.sender, recipient: message.recipient});
    }
    message.save((err) => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.status(200).json({message: "Message Successfully Saved to DB", sender: message.sender, recipient: message.recipient});
      });
    });

module.exports = router;