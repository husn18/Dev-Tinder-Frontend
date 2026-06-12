import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        feed: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setFeed: (state, action) => {
            state.feed = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { setFeed, setLoading, setError } = feedSlice.actions;
export default feedSlice.reducer;