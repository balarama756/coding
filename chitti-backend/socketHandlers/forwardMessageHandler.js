const Message = require('../Models/Message');
const Conversation = require('../Models/Conversation');

const forwardMessageHandler = async (socket, data, io) => {
    const { messageId, toConversationId, authorId } = data;
    try {
        const original = await Message.findById(messageId);
        if (!original) return socket.emit('error', { message: 'Message not found' });

        const forwarded = await Message.create({
            author: authorId,
            content: original.content,
            media: original.media,
            audioUrl: original.audioUrl,
            giphyUrl: original.giphyUrl,
            document: original.document,
            type: original.type,
        });

        const conversation = await Conversation.findById(toConversationId);
        if (!conversation) return socket.emit('error', { message: 'Conversation not found' });

        conversation.messages.push(forwarded._id);
        await conversation.save();

        const updated = await Conversation.findById(toConversationId).populate('participants');
        updated.participants.forEach(p => {
            if (p.socketId) {
                io.to(p.socketId).emit('new-direct-message', {
                    conversationId: toConversationId,
                    message: forwarded,
                });
            }
        });
    } catch (error) {
        console.log('Error in forwardMessageHandler:', error);
    }
};

module.exports = forwardMessageHandler;
