const Message = require('../Models/Message');
const Conversation = require('../Models/Conversation');

const deleteMessageHandler = async (socket, data, io) => {
    const { messageId, conversationId, userId, deleteForEveryone } = data;
    try {
        let updatedMessage;
        if (deleteForEveryone) {
            // Clear content and mark deleted for all
            updatedMessage = await Message.findByIdAndUpdate(
                messageId,
                { content: '', media: [], audioUrl: null, giphyUrl: null, document: null, deletedFor: [] },
                { new: true }
            );
        } else {
            updatedMessage = await Message.findByIdAndUpdate(
                messageId,
                { $addToSet: { deletedFor: userId } },
                { new: true }
            );
        }

        const conversation = await Conversation.findById(conversationId).populate('participants');
        conversation.participants.forEach(p => {
            if (p.socketId) {
                io.to(p.socketId).emit('message-deleted', {
                    conversationId,
                    messageId,
                    deleteForEveryone,
                    deletedFor: updatedMessage.deletedFor,
                });
            }
        });
    } catch (error) {
        console.log('Error in deleteMessageHandler:', error);
    }
};

module.exports = deleteMessageHandler;
