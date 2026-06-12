import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
    authChecked: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authChecked = true;
    },
    removeUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    },
  },
});
export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
