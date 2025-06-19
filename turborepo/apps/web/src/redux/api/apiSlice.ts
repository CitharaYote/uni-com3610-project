import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_REACT_APP_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      console.log("token found :3");
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let res = await baseQuery(args, api, extraOptions);

  console.log("res: ", res);

  // unauthorised
  if (res.error?.status === 401) {
    // clears credentials? TODO: needs testing
    console.log("bad res");
    console.log(res.error);

    api.dispatch(clearCredentials());
    // res = await baseQuery(args, api, extraOptions);
  }

  if (res.error?.status === 403) {
    console.log("sending refresh token");

    const refreshRes = await baseQuery("/refresh", api, extraOptions);
    console.log("refreshRes: ", refreshRes);

    if (refreshRes.data) {
      const user = api.getState().auth.user;
      // api.dispatch(setCredentials({ user, token: refreshRes.data.token }));
      api.dispatch(
        setCredentials({
          user,
          userId: refreshRes.data.userId,
          token: refreshRes.data.accessToken,
          roles: refreshRes.data.roles,
        })
      );
      res = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return res;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
