import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import MessagesReducers from "./messagesControlSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    Chat: MessagesReducers,
  },
});

export default store;
