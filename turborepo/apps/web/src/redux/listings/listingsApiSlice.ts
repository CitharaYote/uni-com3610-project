import { apiSlice } from "../api/apiSlice";

// TODO: add pagination

export const listingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // public endpoints
    getRecentListings: build.query({
      query: () => ({
        url: "/listings/recent",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getEndingSoonListings: build.query({
      query: () => ({
        url: "/listings/ending-soon",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getListing: build.query({
      query: (id) => ({
        url: `/listings/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getSearchOptions: build.query({
      query: () => ({
        url: "/listings/search-options",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getSearchListings: build.query({
      query: (body) => ({
        url: `/listings/search`,
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),

    // user endpoints

    // staff endpoints
    createListing: build.mutation({
      query: (body) => ({
        url: "/staff/listings/new",
        method: "POST",
        body,
      }),
    }),
    updateListing: build.mutation({
      query: (body) => ({
        url: "/staff/listings/edit",
        method: "PUT",
        body,
      }),
    }),
    deleteListing: build.mutation({
      query: (body) => ({
        url: `/staff/listings/delete`,
        method: "DELETE",
        body,
      }),
    }),
    getStaffListingsPaginated: build.query({
      // query stores page and limit
      query: ({ page, limit }) => ({
        url: `/staff/listings?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getStaffListingsEndingSoonPaginated: build.query({
      // query stores page and limit
      query: ({ page, limit }) => ({
        url: `/staff/listings/ending-soon?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getStaffListingsJustEndedPaginated: build.query({
      // query stores page and limit
      query: ({ page, limit }) => ({
        url: `/staff/listings/just-ended?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getStaffListingsRecentPaginated: build.query({
      // query stores page and limit
      query: ({ page, limit }) => ({
        url: `/staff/listings/recent?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getStaffListingsDashboard: build.query({
      query: () => ({
        url: "/staff/listings/dashboard",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getStaffSearchListings: build.query({
      query: (body) => ({
        url: "/staff/listings/search",
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),
    getStaffApplicationNumberFromListing: build.query({
      query: (body) => ({
        url: `/staff/listings/applications/count`,
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),
    getStaffApplicationsFromListing: build.query({
      query: (body) => ({
        url: `/staff/listings/applications`,
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),
    updateApplicationStatus: build.mutation({
      query: (body) => ({
        url: `/staff/listings/applications/update`,
        method: "POST",
        body,
      }),
    }),
    assignStaffToPanel: build.mutation({
      query: (body) => ({
        url: `/staff/listings/assign`,
        method: "POST",
        body,
      }),
    }),
    getPanelMembers: build.query({
      query: (body) => ({
        url: `/staff/listings/panel`,
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),
    setRanking: build.mutation({
      query: (body) => ({
        url: `/staff/listings/ranking`,
        method: "POST",
        body,
      }),
    }),
    getApplicationsFromUser: build.query({
      query: (body) => ({
        url: `/me/applications`,
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRecentListingsQuery,
  useGetEndingSoonListingsQuery,
  useGetListingQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
  useGetStaffListingsPaginatedQuery,
  useGetStaffListingsEndingSoonPaginatedQuery,
  useGetStaffListingsJustEndedPaginatedQuery,
  useGetStaffListingsRecentPaginatedQuery,
  useGetStaffListingsDashboardQuery,
  useGetSearchOptionsQuery,
  useGetSearchListingsQuery,
  useGetStaffSearchListingsQuery,
  useGetStaffApplicationNumberFromListingQuery,
  useGetStaffApplicationsFromListingQuery,
  useUpdateApplicationStatusMutation,
  useAssignStaffToPanelMutation,
  useGetPanelMembersQuery,
  useSetRankingMutation,
  useGetApplicationsFromUserQuery,
} = listingsApiSlice;
