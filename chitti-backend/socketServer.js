const authSocket = require('./middleware/authSocket');
const disconnectHandler = require('./socketHandlers/disconnectHandler');
const chatHistoryHandler = require('./socketHandlers/getMessageHistoryHandler');
const newConnectionHandler = require('./socketHandlers/newConnectionHandler');
const newMessageHandler = require('./socketHandlers/newMessageHandler');
const startTypingHandler = require('./socketHandlers/startTypingHandler');
const stopTypingHandler = require('./socketHandlers/stopTypingHandler');
const markSeenHandler = require('./socketHandlers/markSeenHandler');
const reactToMessageHandler = require('./socketHandlers/reactToMessageHandler');
const deleteMessageHandler = require('./socketHandlers/deleteMessageHandler');
const forwardMessageHandler = require('./socketHandlers/forwardMessageHandler');
const pinMessageHandler = require('./socketHandlers/pinMessageHandler');

const registerSocketServer = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: process.env.CLIENT_URL || '*',
            methods: ['GET', 'POST'],
        },
    });

    io.use((socket, next) => {
        authSocket(socket, next);
    });

    io.on('connection', (socket) => {
        console.log('user connected');
        console.log(socket.id);

        newConnectionHandler(socket, io);

        socket.on('disconnect', () => {
            disconnectHandler(socket);
        });
        socket.on('new-message', (data) => {
            newMessageHandler(socket, data, io);
        });
        socket.on('direct-chat-history', (data) => {
            chatHistoryHandler(socket, data);
        });
        socket.on('start-typing', (data) => {
            startTypingHandler(socket, data, io);
        });
        socket.on('stop-typing', (data) => {
            stopTypingHandler(socket, data, io);
        });
        socket.on('mark-seen', (data) => {
            markSeenHandler(socket, data, io);
        });
        socket.on('react-message', (data) => {
            reactToMessageHandler(socket, data, io);
        });
        socket.on('delete-message', (data) => {
            deleteMessageHandler(socket, data, io);
        });
        socket.on('forward-message', (data) => {
            forwardMessageHandler(socket, data, io);
        });
        socket.on('pin-message', (data) => {
            pinMessageHandler(socket, data, io);
        });
    });
};

module.exports = { registerSocketServer };