const Message = require('../Models/Message');
const Conversation = require('../Models/Conversation');

const reactToMessageHandler = async (socket, data, io) => {
    const { messageId, conversationId, userId, emoji } = data;
    try {
        // Remove existing reaction from this user, then add new one
        const message = await Message.findByIdAndUpdate(
            messageId,
            {
                $pull: { reactions: { userId } },
            },
            { new: true }
        );

        // If emoji is provided, add the reaction (empty emoji = remove reaction)
        let updatedMessage = message;
        if (emoji) {
            updatedMessage = await Message.findByIdAndUpdate(
                messageId,
                { $push: { reactions: { userId, emoji } } },
                { new: true }
            );
        }

        const conversation = await Conversation.findById(conversationId).populate('participants');
        conversation.participants.forEach(p => {
            if (p.socketId) {
                io.to(p.socketId).emit('message-reaction', {
                    conversationId,
                    messageId,
                    reactions: updatedMessage.reactions,
                });
            }
        });
    } catch (error) {
        console.log('Error in reactToMessageHandler:', error);
    }
};

module.exports = reactToMessageHandler;
