// participants
// messages

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    // Group chat
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupAvatar: { type: String },
    groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
    // Pinned messages
    pinnedMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    // Unread tracking: { userId: lastReadAt }
    lastReadAt: { type: Map, of: Date, default: {} },
}, {
    timestamps: true,
});

const Conversation = new mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
