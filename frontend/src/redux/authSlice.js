import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isAuthenticated: false,
  userInfo: null,
};
const auth = createSlice({
  name: "authen",
  initialState,
  reducers: {
    isAuth: (state, action) => {
      console.log(action.payload,"..");
      state.isAuthenticated = true;
      // Handle different response structures
      state.userInfo = action.payload?.user || action.payload || null;
    },
    Logout: (state) => {
      state.userInfo = null; // This sets userInfo to null
      state.isAuthenticated = false; // Reset authentication status
    },
  },
});

export const { isAuth, Logout } = auth.actions;

export default auth.reducer;
