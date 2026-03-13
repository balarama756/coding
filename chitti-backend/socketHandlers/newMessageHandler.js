const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");

const newMessageHandler = async (socket, data, io) => {
    console.log(data, 'new-message');

    const { message, conversationId } = data;

    const { author, content, media, audioUrl, document, type, giphyUrl, replyTo } = message;

    try {
        //  1. Find the conversationId
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return socket.emit('error', { message: 'Conversation not found!' });
        }

        // 2. Create a new Message using the Message Model
        const newMessage = await Message.create({
            author, content, media, audioUrl, document, type, giphyUrl, replyTo: replyTo || null
        });

        // 3. Push the messageId to mesaages array in conversation
        conversation.messages.push(newMessage._id);
        await conversation.save();

        // 4. Populate replyTo on the new message before emitting
        const populatedMessage = await Message.findById(newMessage._id).populate({ path: 'replyTo', select: 'content author' });

        // 5. Populate the conversation with participants to find online users
        const updatedConversation = await Conversation.findById(conversationId).populate('participants');

        //6. Find the participants who are online (status === 'Online') and have a socketId
        const onlineParticipants = updatedConversation.participants.filter(
            (participant) => participant.status === 'Online' && participant.socketId 
        );
        console.log(onlineParticipants);

        //7. Emit 'new-direct-message' event to online participants
        onlineParticipants.forEach((participant) => {
            console.log(participant.socketId);
            io.to(participant.socketId).emit('new-direct-message', {
               conversationId: conversationId,
               message: populatedMessage,
            })
        });
    }
    catch (error) {
        console.log('Error hanadling new message:', error);
        socket.emit('error', { message: 'Failed to send message' });

    }
};

module.exports = newMessageHandler;