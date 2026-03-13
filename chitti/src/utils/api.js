import axiosInstance from './axios';

// Add token to requests
export const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

// User APIs
export const getMe = async () => {
    const response = await axiosInstance.get('/user/me');
    return response.data;
};

export const getUsers = async () => {
    const response = await axiosInstance.get('/user/users');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await axiosInstance.patch('/user/me', data);
    return response.data;
};

export const updateAvatar = async (avatar) => {
    const response = await axiosInstance.patch('/user/avatar', { avatar });
    return response.data;
};

export const updatePassword = async (data) => {
    const response = await axiosInstance.patch('/user/password', data);
    return response.data;
};

// Conversation APIs
export const startConversation = async (userId) => {
    const response = await axiosInstance.post('/user/start-conversations', { userId });
    return response.data;
};

export const getConversations = async () => {
    const response = await axiosInstance.get('/user/conversations');
    return response.data;
};

export const createGroup = async (groupName, participants) => {
    const response = await axiosInstance.post('/user/group', { groupName, participants });
    return response.data;
};

export const blockUser = async (userId) => {
    const response = await axiosInstance.post('/user/block', { userId });
    return response.data;
};

export const unblockUser = async (userId) => {
    const response = await axiosInstance.post('/user/unblock', { userId });
    return response.data;
};

export const searchMessages = async (conversationId, q) => {
    const response = await axiosInstance.get(`/user/search-messages?conversationId=${conversationId}&q=${encodeURIComponent(q)}`);
    return response.data;
};

export const getUnreadCount = async () => {
    const response = await axiosInstance.get('/user/unread-count');
    return response.data;
};
