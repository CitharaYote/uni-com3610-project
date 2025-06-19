import { apiSlice } from "../api/apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    updateProfile: build.mutation({
      query: (body) => ({
        url: "/me",
        method: "PATCH",
        body,
      }),
    }),
    saveListingToUser: build.mutation({
      query: (body) => ({
        url: `/me/save`,
        method: "POST",
        body,
      }),
    }),
    getIsSaved: build.query({
      query: (body) => ({
        url: `/me/saved`,
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),
    getAllSaved: build.query({
      query: (body) => ({
        url: `/me/all_saved`,
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),
    addResourceToMe: build.mutation({
      query: (body) => ({
        url: `/me/add-resource`,
        method: "POST",
        body,
      }),
    }),
    getNotifications: build.query({
      query: () => ({
        url: `/me/notifications`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useSaveListingToUserMutation,
  useGetIsSavedQuery,
  useGetAllSavedQuery,
  useAddResourceToMeMutation,
  useGetNotificationsQuery,
} = profileApiSlice;
