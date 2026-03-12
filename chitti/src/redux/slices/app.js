import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    modals: {
        gif: false,
        audio: false,
        media: false,
        doc: false,  // Modal visibility flag
    },
    selectedGifUrl: '',  // URL of the selected GIF
};

// Create the slice
const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateGifModal(state, action) {
            state.modals.gif = action.payload.value;  // Open/close modal
            state.selectedGifUrl = action.payload.url;  // Update selected GIF URL
        },
        updateAudioModal(state, action) {
            state.modals.audio = action.payload;
        },
        updateMediaModal(state, action) {
            state.modals.media = action.payload;
        },
        updateDocumentModal(state, action) {
            state.modals.doc = action.payload;
        },
    },
});

// Export the reducer
export default slice.reducer;

// Thunk action to toggle the GIF modal
export const ToggleGifModal = (payload) => async (dispatch, getState) => {
    // Dispatch the action to update the GIF modal
    dispatch(slice.actions.updateGifModal(payload));
};

export const ToggleAudioModal = (value) => async (dispatch, getState) => {
    dispatch(slice.actions.updateAudioModal(value));
};

export const ToggleMediaModal = (value) => async (dispatch, getState) => {
    dispatch(slice.actions.updateMediaModal(value));
};

export const ToggleDocumentModal = (value) => async (dispatch, getState) => {
    dispatch(slice.actions.updateDocumentModal(value));
};
