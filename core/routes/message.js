const express = require('express');
const socket_io = require('socket.io')
const passport = require('passport');
const Message = require('../models/Message');
const { userValidationRules, validate, isAuthed } = require('../config/validator');

const io = socket_io();
const router = express.Router();

router.get('/retrieve/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Message.find({ sender: req.user._id, recipient: req.params.id}).exec((err, messages) => {
    if (err) {
      throw err;
      return res.status(404).json(err);
    } else {
      return res.status(200).json(messages);
    }
  });
});

router.post('/send', passport.authenticate('jwt', {session: false}), (req, res) => {
    let message = new Message({
        sender: req.user._id,
        recipient: req.body.recipient,
        body: req.body.body
    });
    message.save((err) => {
      if (err) {
        return res.status(404).json(err);
      }
      req.login(message, (err) => {
        if (err) {
          return res.status(404).json(err);
        }
        return res.status(200).json({message: "Message Successfully Saved to DB", sender: message.sender, recipient: message.recipient});
        })
    });
});

module.exports = router;