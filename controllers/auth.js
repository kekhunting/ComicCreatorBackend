const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isArtist: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date 
    }
})

module.exports = mongoose.model('User', User)