// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import menuReducer from "./slices/menuSlice"; 
import userReducer from "./slices/userSlice"; 
import softwareReducer from "./slices/softwareSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    user: userReducer, 
    software: softwareReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export default store;