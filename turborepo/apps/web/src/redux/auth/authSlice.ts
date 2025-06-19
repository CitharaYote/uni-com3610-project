import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userId: null,
    token: null,
    roles: [],
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, userId, token, roles } = action.payload;
      state.user = user;
      state.userId = userId;
      state.token = token;
      state.roles = roles;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.userId = null;
      state.token = null;
      state.roles = [];
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentUserId = (state: any) => state.auth.userId;
export const selectCurrentToken = (state: any) => state.auth.token;
export const selectCurrentRoles = (state: any) => state.auth.roles;
