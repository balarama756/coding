import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    conversations: [],
    activeConversation: null,
    loading: false,
    error: null,
};

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setConversations(state, action) {
            state.conversations = action.payload;
            state.loading = false;
        },
        setActiveConversation(state, action) {
            state.activeConversation = action.payload;
        },
        addConversation(state, action) {
            const exists = state.conversations.find(c => c._id === action.payload._id);
            if (!exists) {
                state.conversations.unshift(action.payload);
            }
        },
        updateConversationLastMessage(state, action) {
            const { conversationId, message } = action.payload;
            const conversation = state.conversations.find(c => c._id === conversationId);
            if (conversation) {
                conversation.messages = [message];
                conversation.updatedAt = new Date().toISOString();
                // Move to top
                state.conversations = [
                    conversation,
                    ...state.conversations.filter(c => c._id !== conversationId)
                ];
            }
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
    setConversations,
    setActiveConversation,
    addConversation,
    updateConversationLastMessage,
    setLoading,
    setError,
} = conversationSlice.actions;

export default conversationSlice.reducer;
