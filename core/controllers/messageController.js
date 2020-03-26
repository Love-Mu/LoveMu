
const User = require('../models/User');
const Message = require('../models/Message');
const Chatroom = require('../models/Chatroom');

module.exports = {
    send: (req, res) => {
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
            Chatroom.find({ members: [req.user._id, req.body.recipient]}).exec((err, chatroom) => {
                console.log(chatroom);
                if(chatroom[0]._id != undefined){
                    Chatroom.findByIdAndUpdate(chatroom[0]._id, {$push: {messages: message._id}});
                    return res.status(200).json({message: "Message Successfully Saved to DB", sender: message.sender, recipient: message.recipient});
                } else {
                    let chatroom = new Chatroom({
                        members: [req.user._id, req.body.recipient],
                        messages: message._id
                    });
                    chatroom.save((err) => {
                        if (err) {
                            return res.status(404).json(err);
                        }
                        return res.status(200).json({message: "Chatroom Successfully Saved to DB", sender: message.sender, recipient: message.recipient});
                    });
                }
            });
            
        });
    },
    retrieve: (req, res) => {
        Message.find({$or:[{ sender: req.user._id, recipient: req.params.id},{sender: req.params.id, recipient: req.user._id}]}).sort({'created_at':-1}).limit(10).exec((err, messages) => {
            if (err) {
              throw err;
              return res.status(404).json(err);
            } else {
              return res.status(200).json(messages);
            }
        })
    }
};