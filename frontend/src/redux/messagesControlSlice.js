import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isVisbile: false,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    ShowChat: (state, action) => {
      console.log(action.payload);
      state.isVisbile = action.payload.isVisbile;
    },
  },
});

export const { ShowChat } = messagesSlice.actions;
export default messagesSlice.reducer;
