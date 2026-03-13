// author 
// content 
// media
// audioUrl
// document
// giphyUrl
// date
// type => Media | Text | Document | Audio | Giphy

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const documentScheme = new Schema({
    url: { type: String },
    name: {type: String },
    size: {type: Number }, 
});

const reactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    emoji: { type: String },
}, { _id: false });

const messageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        trim: true,
    },
    media: [
        {
            type: {
                type: String,
                enum: ['image', 'video'],
            },
            url: { type: String }
        }
    ],
    audioUrl: { type: String },
    giphyUrl: { type: String },
    type: {
        type: String,
        enum: ['Media', 'Text', 'Document', 'Giphy', 'Audio'],
    },
    document: documentScheme,
    // Read receipts
    seenBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // Reactions
    reactions: [reactionSchema],
    // Reply to message
    replyTo: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    // Soft delete
    deletedFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});

const Message = new mongoose.model('Message', messageSchema);

module.exports = Message;