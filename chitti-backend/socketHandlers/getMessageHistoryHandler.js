const Conversation = require("../Models/Conversation");

const chatHistoryHandler = async (Socket, data) => {
    try {

        // Converstion ID
        const { conversationId } = data;

        console.log(data, 'conversation Id');

        // Find the conversation by ID and populate the message

        const conversation = await Conversation.findById(conversationId).select('messages').populate({ path: 'messages', populate: { path: 'replyTo', select: 'content author' } });

        if(!conversation) {
            return Socket.emit('error', {message: 'Conversation not found'});
        }

        // Prepare the response data
        const res_data = {
            conversationId,
            history: conversation.messages,
        };

        // Emit the chat history back to same socket

        Socket.emit('chat-history', res_data);
    }
    catch (error) {
        // Handle any errors and send error event back
        Socket.emit('error', { message: 'Failed to fetch chat history', error });
    }
};
module.exports = chatHistoryHandler;