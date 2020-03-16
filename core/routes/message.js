/*const express = require('express');
const socket_io = require('socket.io')

const ChatRoom = require('../models/ChatRoom.js');
const Message = require('../models/Message.js');

const io = socket_io();
const router = express.Router();

router.get('/retrieve', ensureAuthenticated, (req, res) => {
    
})

router.post('/send', ensureAuthenticated, (req, res) => {
    let msg = new Message({
        sender: req.user._id,
        recipient: req.body.recipient,
        body: req.body.message,
    });
});


function ensureAuthenticated(req, res, next)
 {
  if (req.isAuthenticated()) {
    console.log('Authenticated');
    return next();
  }
  console.log('Unauthenticated');
  res.status(403).json({msg: 'Unauthenticated'});
}
*/