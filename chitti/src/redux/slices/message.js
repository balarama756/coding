import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    loading: false,
    error: null,
    typingUsers: {},
};

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessages(state, action) {
            state.messages = action.payload;
            state.loading = false;
        },
        addMessage(state, action) {
            state.messages.push(action.payload);
        },
        clearMessages(state) {
            state.messages = [];
        },
        setTyping(state, action) {
            const { conversationId, typing } = action.payload;
            state.typingUsers[conversationId] = typing;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    setMessages,
    addMessage,
    clearMessages,
    setTyping,
    setLoading,
    setError,
} = messageSlice.actions;

export default messageSlice.reducer;
