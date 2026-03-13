import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

// slices 
import appReducer from './slices/app';
import authReducer from './slices/auth';
import conversationReducer from './slices/conversation';
import messageReducer from './slices/message';

const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    blacklist: ['auth'], // auth has its own persist config
};

// Separate persist config for auth — exclude transient states
const authPersistConfig = {
    key: 'auth',
    storage,
    keyPrefix: 'redux-',
    blacklist: ['isLoading', 'error'], // never persist loading/error states
};

const rootReducer = combineReducers({
    app: appReducer,
    auth: persistReducer(authPersistConfig, authReducer),
    conversation: conversationReducer,
    message: messageReducer,
});

export { rootPersistConfig, rootReducer };