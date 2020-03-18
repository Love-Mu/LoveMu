const express = require('express');
const socket_io = require('socket.io')

const Message = require('../models/Message');
const { userValidationRules, validate, ensureAuthenticated } = require('../config/validator');

const io = socket_io();
const router = express.Router();

router.get('/retrieve', ensureAuthenticated, (req, res) => {
    Message.findAll({'$or':[{'$and':[{'sender':req.user._id},{'recipient' : req.body._id},{'sender':req.body._id},{'recipient' : req.user._id}]}]}).populate('sender').populate('recipient').exec((err, msg) => {
      if (err) {
        return res.status(404).json(err);
      }
      else{
        return res.status(200).json({message: "Got this far!!!"});
      }
    })
});

router.post('/send', ensureAuthenticated, (req, res) => {
    let msg = new Message({
        sender: req.user._id,
        recipient: req.body.recipient,
        body: req.body.message,
    });
});

module.exports = router;