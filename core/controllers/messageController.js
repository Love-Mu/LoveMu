const {validationResult} = require('express-validator');
const User = require('../models/User');
const Message = require('../models/Message');
const Chatroom = require('../models/Chatroom');

module.exports = {
    send: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json(errors);
        }
        let message = new Message({
            sender: req.user._id,
            recipient: req.body.recipient,
            body: req.body.body
        });

        if(message.body == null || message.body == ''){
        console.log("This message is blank");
        return res.status(403).json({message: "Blank message", sender: message.sender, recipient: message.recipient});
        }

        message.save((err) => {
            if (err) {
                return res.status(403).json(err);
            }
            Chatroom.findOne({$or:[{ members: [req.user._id, req.body.recipient] },{ members: [req.body.recipient, req.user._id] }]}).exec((err, chatroom) => {
                if(chatroom != undefined){
                    chatroom.messages.push(message._id);
                    chatroom.save((err) => {
                        if (err) {
                            return res.status(404).json(err);
                        }
                        return res.status(200).json({message: "Message Successfully Saved to DB", chatroomId: chatroom._id, _id: message._id, created_at: message.created_at});
                    })
                } else {
                    let chatroom = new Chatroom({
                        members: [req.user._id, req.body.recipient],
                        messages: message._id
                    });
                    chatroom.save((err) => {
                        if (err) {
                            return res.status(404).json(err);
                        }
                        return res.status(200).json({message: "Chatroom & Message Successfully Saved to DB", chatroomId: chatroom._id, _id: message._id, created_at: message.created_at});
                    });
                }
            });
            
        });
    },
    retrieve: (req, res) => {
        Chatroom.findOne({$or:[{ members: [req.user._id, req.params.id] },{ members: [req.params.id, req.user._id] }]}).exec((err, chatroom) => {
            if (err) {
                throw err;
                return res.status(500).json(err);
            } else if (chatroom != undefined) {
                Message.find().where('_id').in(chatroom.messages).sort({created_at: -1}).limit(15).exec((err, messages) => {
                    return res.status(200).json(messages);
                });
            }
        });
    },
    retrieveNext: (req, res) => {
        Chatroom.findOne({$or:[{ members: [req.user._id, req.params.id] },{ members: [req.params.id, req.user._id] }]}).exec((err, chatroom) => {
            if (err) {
                throw err;
                return res.status(500).json(err);
            } else if (chatroom != undefined) {
                Message.find().where('_id').in(chatroom.messages).sort({created_at: -1}).skip(parseInt(req.params.pos)).limit(10).exec((err, messages) => {
                    return res.status(200).json(messages);
                });
            }
        });
    },
    chatroom: (req, res) => {
        Chatroom.find({members: { "$in" : [req.user._id] }}).exec(async (err, chatroom) => {
            let rooms = [];
            if (err) {
                throw err;
                return res.status(500).json(err);
            } else if (chatroom.length != 0) {
                console.log(chatroom);
                chatroom.forEach((element, index) => {
                    let message = "";
                    let messagePromise = new Promise(function (resolve, reject) {
                        Message.findOne({_id: element.messages.pop()}).exec((err, msg) => {
                            if (err) {
                                reject(err);
                            }
                            message = msg;
                            console.log(msg);
                            resolve();
                        });
                    });
                    messagePromise.then(() => {
                        console.log(message);
                        rooms.push({"_id": element._id, "members": element.members, "messages": [message]});
                        if(index == chatroom.length - 1) return res.status(200).json(rooms);
                    })
                });
            } else {
                return res.status(200).json(rooms);
            }
        });
    }
};