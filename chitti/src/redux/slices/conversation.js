import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    conversations: [],
    activeConversation: null,
    loading: false,
    error: null,
    unreadCounts: {},
    blockedUsers: [],
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
            // Clear unread for this conversation
            if (action.payload?._id) {
                delete state.unreadCounts[action.payload._id];
            }
        },
        addConversation(state, action) {
            const exists = state.conversations.find(c => c._id === action.payload._id);
            if (!exists) state.conversations.unshift(action.payload);
        },
        updateParticipantStatus(state, action) {
            const { userId, status, lastSeen } = action.payload;
            state.conversations.forEach(conv => {
                conv.participants.forEach(p => {
                    if (p._id === userId) { p.status = status; if (lastSeen) p.lastSeen = lastSeen; }
                });
            });
            if (state.activeConversation) {
                state.activeConversation.participants.forEach(p => {
                    if (p._id === userId) { p.status = status; if (lastSeen) p.lastSeen = lastSeen; }
                });
            }
        },
        updateConversationLastMessage(state, action) {
            const { conversationId, message } = action.payload;
            const conversation = state.conversations.find(c => c._id === conversationId);
            if (conversation) {
                conversation.messages = [message];
                conversation.updatedAt = new Date().toISOString();
                state.conversations = [
                    conversation,
                    ...state.conversations.filter(c => c._id !== conversationId)
                ];
            }
        },
        setUnreadCounts(state, action) {
            state.unreadCounts = action.payload;
        },
        incrementUnread(state, action) {
            const { conversationId } = action.payload;
            if (state.activeConversation?._id !== conversationId) {
                state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
            }
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        toggleBlockUser(state, action) {
            const userId = action.payload;
            if (state.blockedUsers.includes(userId)) {
                state.blockedUsers = state.blockedUsers.filter(id => id !== userId);
            } else {
                state.blockedUsers.push(userId);
            }
        },
    },
});

export const {
    setConversations,
    setActiveConversation,
    addConversation,
    updateConversationLastMessage,
    updateParticipantStatus,
    setUnreadCounts,
    incrementUnread,
    setLoading,
    setError,
    toggleBlockUser,
} = conversationSlice.actions;

export default conversationSlice.reducer;
