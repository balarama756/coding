const Message = require('../Models/Message');
const Conversation = require('../Models/Conversation');

const markSeenHandler = async (socket, data, io) => {
    const { conversationId, userId } = data;
    try {
        // Mark all messages in conversation as seen by this user
        await Message.updateMany(
            { _id: { $in: (await Conversation.findById(conversationId).select('messages')).messages }, seenBy: { $ne: userId } },
            { $addToSet: { seenBy: userId } }
        );

        // Update lastReadAt for this user
        await Conversation.findByIdAndUpdate(conversationId, {
            [`lastReadAt.${userId}`]: new Date(),
        });

        // Notify all participants in the conversation
        const conversation = await Conversation.findById(conversationId).populate('participants');
        conversation.participants.forEach(p => {
            if (p.socketId && p._id.toString() !== userId) {
                io.to(p.socketId).emit('messages-seen', { conversationId, seenBy: userId });
            }
        });
    } catch (error) {
        console.log('Error in markSeenHandler:', error);
    }
};

module.exports = markSeenHandler;
