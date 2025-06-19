import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";
import authReducer from "./auth/authSlice";
import listingsReducer from "./listings/listingsSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";
import persistCombineReducers from "redux-persist/es/persistCombineReducers";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "listings"],
};

export const persistedReducer = persistCombineReducers(persistConfig, {
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  listings: listingsReducer,
});

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, thunk),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

export const persistor = persistStore(store);
