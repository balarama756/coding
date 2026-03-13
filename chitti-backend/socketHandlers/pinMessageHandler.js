const Conversation = require('../Models/Conversation');

const pinMessageHandler = async (socket, data, io) => {
    const { messageId, conversationId, pin } = data;
    try {
        const update = pin
            ? { $addToSet: { pinnedMessages: messageId } }
            : { $pull: { pinnedMessages: messageId } };

        const conversation = await Conversation.findByIdAndUpdate(conversationId, update, { new: true }).populate('participants');

        conversation.participants.forEach(p => {
            if (p.socketId) {
                io.to(p.socketId).emit('pin-updated', {
                    conversationId,
                    pinnedMessages: conversation.pinnedMessages,
                });
            }
        });
    } catch (error) {
        console.log('Error in pinMessageHandler:', error);
    }
};

module.exports = pinMessageHandler;
