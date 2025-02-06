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
      console.log(action.payload);
      state.isAuthenticated = true;
      state.userInfo = action.payload.user;
    },
    Logout: (state) => {
      state.userInfo = null; // This sets userInfo to null
    },
  },
});

export const { isAuth, Logout } = auth.actions;

export default auth.reducer;
