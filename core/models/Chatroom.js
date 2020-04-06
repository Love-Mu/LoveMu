const mongoose = require('mongoose');
const User = require('./User');
const Message = require('./Message');

const Schema = mongoose.Schema;

const chatroomSchema = new Schema ({
    members:{
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User'
    },
    messages:{
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Message'
    }
});

module.exports = mongoose.model('Chatroom', chatroomSchema);