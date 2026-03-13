import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    loading: false,
    error: null,
    typingUsers: {},
    pinnedMessages: [],
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
            state.pinnedMessages = [];
        },
        setTyping(state, action) {
            const { conversationId, typing } = action.payload;
            state.typingUsers[conversationId] = typing;
        },
        updateMessageSeen(state, action) {
            const { seenBy } = action.payload;
            state.messages.forEach(msg => {
                if (!msg.seenBy) msg.seenBy = [];
                if (!msg.seenBy.includes(seenBy)) msg.seenBy.push(seenBy);
            });
        },
        updateMessageReaction(state, action) {
            const { messageId, reactions } = action.payload;
            const msg = state.messages.find(m => m._id === messageId);
            if (msg) msg.reactions = reactions;
        },
        deleteMessage(state, action) {
            const { messageId, deleteForEveryone, deletedFor } = action.payload;
            const msg = state.messages.find(m => m._id === messageId);
            if (!msg) return;
            if (deleteForEveryone) {
                msg.content = '';
                msg.media = [];
                msg.audioUrl = null;
                msg.giphyUrl = null;
                msg.document = null;
                msg._deleted = true;
            } else {
                msg.deletedFor = deletedFor;
            }
        },
        setPinnedMessages(state, action) {
            state.pinnedMessages = action.payload;
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
    updateMessageSeen,
    updateMessageReaction,
    deleteMessage,
    setPinnedMessages,
    setLoading,
    setError,
} = messageSlice.actions;

export default messageSlice.reducer;
