import { createSlice } from "@reduxjs/toolkit";

const listingsSlice = createSlice({
  name: "listings",
  initialState: {
    newListingCache: {
      _id: "", // only used to make the type stop complaining
      reference: "",
      title: "",
      description: "",
      workingPattern: "",
      jobType: "",
      contractType: "",
      faculty: "",
      department: "",
      tags: [],
      location: {
        remote: "",
        locationName: "",
        linkedLocationId: "",
      },
      salary: {
        min: undefined,
        max: undefined,
        potentialMax: undefined,
        grade: "",
        currency: "GBP",
        proRata: false,
        hidden: false,
      },
      dates: {
        listingDate: new Date().toISOString(),
        // set closing date to 2 weeks from now
        closingDate: new Date(
          new Date().setDate(new Date().getDate() + 14)
        ).toISOString(),
        hideClosingDate: false,
      },
      ranking: [],
      visible: false,
    },
  },
  reducers: {
    setNewListingCache: (state, action) => {
      state.newListingCache = action.payload;
    },
    clearNewListingCache: (state) => {
      state.newListingCache = {
        _id: "",
        reference: "",
        title: "",
        description: "",
        workingPattern: "",
        jobType: "",
        contractType: "",
        faculty: "",
        department: "",
        tags: [],
        location: {
          remote: "",
          locationName: "",
          linkedLocationId: "",
        },
        salary: {
          min: undefined,
          max: undefined,
          potentialMax: undefined,
          grade: "",
          currency: "GBP",
          proRata: false,
          hidden: false,
        },
        dates: {
          listingDate: new Date().toISOString(),
          closingDate: new Date(
            new Date().setDate(new Date().getDate() + 14)
          ).toISOString(),
          hideClosingDate: false,
        },
        ranking: [],
        visible: false,
      };
    },
  },
});

export const { setNewListingCache, clearNewListingCache } =
  listingsSlice.actions;

export default listingsSlice.reducer;

export const selectNewListingCache = (state: any) =>
  state.listings.newListingCache;
