const mongoose = require("mongoose");
const template  = mongoose.Schema;
const MessageSchema = new template({
    contents: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    flatId: {
        type: mongoose.Schema.ObjectId,
        ref: 'flats',
        required: [true, 'Message must belong to a flat.']
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: [true, 'Message must belong to a user.']
    }
})

module.exports = mongoose.model('messages', MessageSchema);