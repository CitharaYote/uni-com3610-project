import { apiSlice } from "../api/apiSlice";

export const applicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // public endpoints
    newApplication: build.mutation({
      query: (body) => ({
        url: "/applications/new",
        method: "POST",
        body,
      }),
    }),
    getApplicationFromListing: build.query({
      query: (body) => ({
        url: "/me/applications/view",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useNewApplicationMutation, useGetApplicationFromListingQuery } =
  applicationApiSlice;
