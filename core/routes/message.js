const express = require('express');
const socket_io = require('socket.io')
const passport = require('passport');
const MessageController = require('../controllers/messageController');
const Message = require('../models/Message');
const Chatroom = require('../models/Chatroom');
const { messageValidationRules, validate, isAuthed } = require('../config/validator');

const io = socket_io();
const router = express.Router();

router.get('/retrieve/:id', passport.authenticate('jwt', {session: false}), MessageController.retrieve);

router.get('/retrieveNext/:id/:pos', passport.authenticate('jwt', {session: false}), MessageController.retrieveNext);

router.post('/send', passport.authenticate('jwt', {session: false}), MessageController.send);

router.get('/chatroom', passport.authenticate('jwt', {session: false}), MessageController.chatroom);

module.exports = router;