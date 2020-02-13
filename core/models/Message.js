const mongoose = require('mongoose');
const User = require('../models/User');

const Schema = mongoose.Schema;

//each instance of a Message contains a sender, recipient, created_at, message body
//Messages can be stored in an array in a chat Schema (usefule for gcs) or just a user/user array

const messageSchema = new Schema ({
    sender:{
        type: User.user_id
    },
    recipient:{
        type: User.user_id
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    body:{
        type: String
    },
});

module.exports = mongoose.model('Message', messageSchema);