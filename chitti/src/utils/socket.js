import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
            auth: {
                token: token,
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        console.warn('Socket not initialized. Call connectSocket first.');
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('Socket disconnected manually');
    }
};
