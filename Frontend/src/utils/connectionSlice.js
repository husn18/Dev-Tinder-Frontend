import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connection",
    initialState: {
        connections: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setConnections: (state, action) => {
            state.connections = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});
export const { setConnections, setLoading, setError } = connectionSlice.actions;
export default connectionSlice.reducer;
