const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const mongoose = require('mongoose');
const socketServer = require('./socketServer');
const http = require('http');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
socketServer.registerSocketServer(server);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connection successful!');
    server.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
    });
}).catch((err) => {
    console.log('Database connection failed. Server not started.');
    console.log(err);
});
