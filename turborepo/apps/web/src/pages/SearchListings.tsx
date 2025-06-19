/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import UserModal from "../components/admin/UserModal";
import Modal from "../components/misc/Modal";
import PageSkeleton from "../utils/PageSkeleton";
import NewListingModal from "../components/staff/NewListingModal";
import DataCard from "../components/misc/DataCard";
import { useDispatch } from "react-redux";
import {
  useGetSearchListingsQuery,
  useGetSearchOptionsQuery,
} from "../redux/listings/listingsApiSlice";
import ListingType from "../types/ListingType";
import EditListingModal from "../components/staff/EditListingModal";
import ViewListingModal from "../components/listings/ViewListingModal";
import ListingTypePublic from "../types/ListingTypePublic";
import { useNavigate } from "react-router-dom";
import workingPatternStrings from "../utils/conversions/workingPatternStrings";
import jobTypeStrings from "../utils/conversions/jobTypeStrings";
import contractTypeStrings from "../utils/conversions/contractTypeStrings";
import locationTypeStrings from "../utils/conversions/locationTypeStrings";
import TextInputBox from "../components/misc/TextInputBox";
import SelectInputBox from "../components/misc/SelectInputBox";
import LoadingSpinner from "../components/misc/LoadingSpinner";

// Package Imports

// Component Imports

// Asset Imports

type QueryType = {
  search: {
    string: string | undefined;
  };
  filters: {
    jobType:
      | "academic"
      | "clerical"
      | "clinical"
      | "facilities"
      | "management"
      | "research"
      | "teaching"
      | "technical"
      | "other"
      | undefined;
    contractType:
      | "permanent"
      | "fixed-term"
      | "open-ended"
      | "other"
      | undefined;
    workingPattern:
      | "full-time"
      | "part-time"
      | "flexible"
      | "contract"
      | "temporary"
      | "internship"
      | "apprenticeship"
      | "volunteer"
      | "other"
      | undefined;
    faculty: string | undefined;
    department: string | undefined;
    location: string | undefined;
    salary: {
      min: number | undefined;
      max: number | undefined;
    };
    tags: string[] | undefined;
  };
  sort: {
    field: "title" | "dates.listingDate" | "dates.closingDate" | undefined;
    order: "asc" | "desc" | undefined;
  };
  page: number;
  limit: number;
};
/**
 * Staff renders a React page.
 */
const SearchListings = () => {
  const [activeTab, setActiveTab] = useState("staff_home");
  const [activeModal, setActiveModal] = useState("");
  const [activeModalInitialTab, setActiveModalInitialTab] = useState("");
  const [focusTarget, setFocusTarget] = useState<ListingTypePublic>();
  const [collapseSearchOptions, setCollapseSearchOptions] = useState(false);
  const [query, setQuery] = useState<QueryType>({
    search: { string: "" },
    filters: {
      jobType: undefined,
      contractType: undefined,
      workingPattern: undefined,
      faculty: undefined,
      department: undefined,
      location: undefined,
      salary: { min: -Infinity, max: Infinity },
      tags: [],
    },
    sort: { field: "title", order: "asc" },
    page: 1,
    limit: 10,
  });

  //   const [searchQuery, setSearchQuery] = useState<QueryType>(query);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: searchOptions,
    isLoading: isLoadingSearchOptions,
    isSuccess: isSuccessSearchOptions,
    isError: isErrorSearchOptions,
    refetch: refetchSearchOptions,
  } = useGetSearchOptionsQuery({ refetchOnMountOrArgChange: false });

  const [searchResults, setSearchResults] = useState<ListingTypePublic[]>([]);

  const {
    data: jobPostingsSearch,
    isLoading: isLoadingJobPostingsSearch,
    isSuccess: isSuccessJobPostingsSearch,
    isError: isErrorJobPostingsSearch,
    refetch: refetchJobPostingsSearch,
  } = useGetSearchListingsQuery({
    search: query,
    refetchOnMountOrArgChange: true,
  });

  const handleSearch = async () => {
    // console.log("query: ", query);

    if (query === undefined) {
      return;
    }
    // await setSearchQuery(query);
    const res = await refetchJobPostingsSearch();
    // console.log("jobPostingsSearch: ", res);
  };

  // console.log("searchoptions: ", searchOptions);

  return (
    <PageSkeleton heading="Search Listings">
      <div className="grid w-full h-full max-w-6xl grid-cols-4 gap-8 mt-8">
        <div className="flex flex-col items-center col-span-4 px-4 py-8 transition-shadow bg-white shadow-lg gap-y-4 rounded-2xl hover:shadow-xl text-uos-gray">
          <div className="flex flex-row items-center justify-center w-full gap-x-4 ">
            <p className="text-3xl font-light ">Search Listings</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-search text-uos-lightgray"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </div>
          <AnimatePresence mode="wait">
            {isLoadingSearchOptions && <LoadingSpinner />}
            {isSuccessSearchOptions &&
              !isErrorSearchOptions &&
              searchOptions && (
                <motion.div
                  className="grid w-full grid-cols-4 overflow-y-hidden gap-y-4 gap-x-8"
                  initial={{ opacity: 0, height: "auto" }}
                  animate={{
                    opacity: 1,
                    height: collapseSearchOptions ? 0 : "auto",
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  key="searchOptions"
                >
                  <TextInputBox
                    className="col-span-1"
                    labelText="Search"
                    value={query.search.string}
                    onChange={(value) => {
                      setQuery({ ...query, search: { string: value } });
                    }}
                    placeholder="Search for listings..."
                  />
                  <SelectInputBox
                    className="col-span-1"
                    labelText="Job Type"
                    value={query.filters.jobType ? query.filters.jobType : ""}
                    onChange={(value) => {
                      setQuery({
                        ...query,
                        filters: { ...query.filters, jobType: value },
                      });
                    }}
                    options={[
                      { value: "academic", label: "Academic" },
                      { value: "clerical", label: "Clerical" },
                      { value: "clinical", label: "Clinical" },
                      { value: "facilities", label: "Facilities" },
                      { value: "management", label: "Management" },
                      { value: "research", label: "Research" },
                      { value: "teaching", label: "Teaching" },
                      { value: "technical", label: "Technical" },
                      { value: "other", label: "Other" },
                    ]}
                    canSelectPlaceholder={true}
                    placeholder="Select Job Type"
                  />
                  <SelectInputBox
                    className="col-span-1"
                    labelText="Contract Type"
                    value={
                      query.filters.contractType
                        ? query.filters.contractType
                        : ""
                    }
                    onChange={(value) => {
                      setQuery({
                        ...query,
                        filters: { ...query.filters, contractType: value },
                      });
                    }}
                    options={[
                      { value: "permanent", label: "Permanent" },
                      { value: "fixed-term", label: "Fixed Term" },
                      { value: "open-ended", label: "Open Ended" },
                      { value: "other", label: "Other" },
                    ]}
                    canSelectPlaceholder={true}
                    placeholder="Select Contract Type"
                  />
                  <SelectInputBox
                    className="col-span-1"
                    labelText="Working Pattern"
                    value={
                      query.filters.workingPattern
                        ? query.filters.workingPattern
                        : ""
                    }
                    onChange={(value) => {
                      setQuery({
                        ...query,
                        filters: { ...query.filters, workingPattern: value },
                      });
                    }}
                    options={[
                      { value: "full-time", label: "Full Time" },
                      { value: "part-time", label: "Part Time" },
                      { value: "flexible", label: "Flexible" },
                      { value: "contract", label: "Contract" },
                      { value: "temporary", label: "Temporary" },
                      { value: "internship", label: "Internship" },
                      { value: "apprenticeship", label: "Apprenticeship" },
                      { value: "volunteer", label: "Volunteer" },
                      { value: "other", label: "Other" },
                    ]}
                    canSelectPlaceholder={true}
                    placeholder="Select Working Pattern"
                  />
                  <SelectInputBox
                    className="col-span-1"
                    labelText="Faculty"
                    value={query.filters.faculty ? query.filters.faculty : ""}
                    onChange={(value) => {
                      setQuery({
                        ...query,
                        filters: { ...query.filters, faculty: value },
                      });
                    }}
                    options={searchOptions.faculty.map((faculty) => {
                      return { value: faculty, label: faculty };
                    })}
                    canSelectPlaceholder={true}
                    placeholder={
                      searchOptions.faculty.length > 0
                        ? "Select Faculty"
                        : "No Faculties Available"
                    }
                  />
                  <SelectInputBox
                    className="col-span-1"
                    labelText="Department"
                    value={
                      query.filters.department ? query.filters.department : ""
                    }
                    onChange={(value) => {
                      setQuery({
                        ...query,
                        filters: { ...query.filters, department: value },
                      });
                    }}
                    options={searchOptions.department.map((department) => {
                      return { value: department, label: department };
                    })}
                    canSelectPlaceholder={true}
                    placeholder={
                      searchOptions.department.length > 0
                        ? "Select Department"
                        : "No Departments Available"
                    }
                  />
                  <SelectInputBox
                    className="col-span-1"
                    labelText="Location"
                    value={query.filters.location ? query.filters.location : ""}
                    onChange={(value) => {
                      setQuery({
                        ...query,
                        filters: { ...query.filters, location: value },
                      });
                    }}
                    options={searchOptions.location.map((location) => {
                      return { value: location, label: location };
                    })}
                    canSelectPlaceholder={true}
                    placeholder={
                      searchOptions.location.length > 0
                        ? "Select Location"
                        : "No Locations Available"
                    }
                  />
                  <SelectInputBox
                    className="col-span-1 col-start-1"
                    labelText="Sort By"
                    value={query.sort.field ? query.sort.field : ""}
                    onChange={(value) => {
                      setQuery({
                        ...query,
                        sort: { ...query.sort, field: value },
                      });
                    }}
                    options={[
                      { value: "title", label: "Title" },
                      { value: "dates.listingDate", label: "Listing Date" },
                      { value: "dates.closingDate", label: "Closing Date" },
                    ]}
                    canSelectPlaceholder={true}
                    placeholder="Select Sort Field"
                  />
                  <SelectInputBox
                    className="col-span-1 col-start-2"
                    labelText="Sort Order"
                    value={query.sort.order ? query.sort.order : ""}
                    onChange={(value) => {
                      setQuery({
                        ...query,
                        sort: { ...query.sort, order: value },
                      });
                    }}
                    options={[
                      { value: "asc", label: "Ascending" },
                      { value: "desc", label: "Descending" },
                    ]}
                    canSelectPlaceholder={true}
                    placeholder="Select Sort Order"
                  />
                  <button
                    className="col-span-1 col-start-3 px-4 py-2 mt-auto text-white transition-colors bg-red-700 rounded-md h-min hover:bg-red-600 focus:outline-none"
                    onClick={() => {
                      setQuery({
                        search: { string: "" },
                        filters: {
                          jobType: undefined,
                          contractType: undefined,
                          workingPattern: undefined,
                          faculty: undefined,
                          department: undefined,
                          location: undefined,
                          salary: { min: -Infinity, max: Infinity },
                          tags: [],
                        },
                        sort: { field: "title", order: "asc" },
                        page: 1,
                        limit: 10,
                      });
                    }}
                  >
                    <p className="my-0.5">Clear Filters</p>
                  </button>
                  <button
                    className="col-span-1 col-start-4 px-4 py-2 mt-auto text-white transition-colors rounded-md bg-uos-purple h-min hover:bg-uos-purple-hover focus:outline-none"
                    onClick={handleSearch}
                  >
                    <p className="my-0.5">Search</p>
                  </button>
                </motion.div>
              )}
            {isErrorSearchOptions && (
              <motion.p
                className="text-red-600"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                key="searchOptionsError"
              >
                Error loading search options
              </motion.p>
            )}
          </AnimatePresence>
          <button
            className="flex flex-row items-center w-full py-4 gap-x-4 text-uos-gray focus:outline-none"
            onClick={() => {
              setCollapseSearchOptions(!collapseSearchOptions);
            }}
          >
            <hr className="w-full" />
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-chevron-up"
              viewBox="0 0 16 16"
              initial={{ rotate: 0 }}
              animate={{
                rotate: collapseSearchOptions ? 180 : 0,
              }}
            >
              <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
              />
            </motion.svg>
            <p className="font-light whitespace-nowrap">
              {collapseSearchOptions ? "Show Filters" : "Hide Filters"}
            </p>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-chevron-up"
              viewBox="0 0 16 16"
              initial={{ rotate: 0 }}
              animate={{
                rotate: collapseSearchOptions ? 180 : 0,
              }}
            >
              <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
              />
            </motion.svg>
            <hr className="w-full" />
          </button>
          {isLoadingJobPostingsSearch && <LoadingSpinner />}
          <div
            className={`w-full px-8 pb-8 overflow-y-auto transition-transform ${collapseSearchOptions ? "max-h-[48rem]" : "max-h-96"}`}
          >
            {isErrorJobPostingsSearch && (
              <p className="text-red-600">Error loading job postings</p>
            )}
            {isSuccessJobPostingsSearch &&
              !isErrorJobPostingsSearch &&
              jobPostingsSearch.jobPostings &&
              jobPostingsSearch.jobPostings.map(
                (jobPosting: ListingTypePublic) => {
                  return (
                    <button
                      key={"searchListing_" + jobPosting._id}
                      className="flex flex-col items-center w-full px-2 py-1 font-light transition-colors gap-y-2 hover:bg-gray-50 focus:outline-none"
                      onClick={() => {
                        setFocusTarget(jobPosting);
                        setActiveModalInitialTab("listing_home");
                        setActiveModal("view_listing");
                      }}
                    >
                      <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-col gap-y-1">
                          <h3 className="mr-2 text-left line-clamp-1">
                            {jobPosting.title}
                          </h3>
                          <div className="flex flex-row items-center justify-start w-full gap-x-2">
                            <p className="text-xs font-light text-uos-gray">
                              {jobTypeStrings[jobPosting.jobType]}
                            </p>
                            <p className="text-xs font-light text-uos-gray">
                              {workingPatternStrings[jobPosting.workingPattern]}
                            </p>
                            <p className="text-xs font-light text-uos-gray">
                              {locationTypeStrings[jobPosting.location.remote]}
                            </p>
                            <p className="text-xs font-light text-uos-gray">
                              {contractTypeStrings[jobPosting.contractType]}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row items-center w-48 gap-x-4">
                          <div className="flex flex-col w-24 text-sm">
                            <p className="text-xs">Posted</p>
                            <p className="text-ellipsis">
                              {new Date(
                                jobPosting.dates.listingDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col w-24 text-sm">
                            <p className="text-xs">Closing</p>
                            <p className="text-ellipsis">
                              {jobPosting.dates.closingDate
                                ? new Date(
                                    jobPosting.dates.closingDate
                                  ).toLocaleDateString()
                                : "No closing date"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            {isSuccessJobPostingsSearch &&
              !isErrorJobPostingsSearch &&
              jobPostingsSearch.jobPostings && (
                <div className="flex flex-col items-center w-full">
                  <p className="mt-4 text-sm font-light text-uos-gray">
                    {jobPostingsSearch.jobPostings.length === 0
                      ? "No listings found"
                      : `Displaying ${
                          // eg 1-10 of 100 listings
                          query.page * query.limit - query.limit + 1
                        }-${
                          query.page * query.limit > jobPostingsSearch.count
                            ? jobPostingsSearch.count
                            : query.page * query.limit
                        } of ${jobPostingsSearch.count} listing${
                          jobPostingsSearch.jobPostings.length === 1 ? "" : "s"
                        }`}
                  </p>
                  <div className="flex flex-row items-center mt-4 gap-x-2">
                    <button
                      className="p-2 text-white transition-colors rounded-md bg-uos-purple h-min hover:bg-uos-purple-hover focus:outline-none disabled:bg-uos-lightgray "
                      onClick={() => {
                        setQuery({
                          ...query,
                          page: 1,
                        });
                      }}
                      disabled={query.page === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-bar-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0M4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-white transition-colors rounded-md bg-uos-purple h-min hover:bg-uos-purple-hover focus:outline-none disabled:bg-uos-lightgray "
                      onClick={() => {
                        setQuery({
                          ...query,
                          page:
                            query.page >
                            Math.ceil(jobPostingsSearch.count / query.limit)
                              ? Math.ceil(jobPostingsSearch.count / query.limit)
                              : query.page - 1,
                        });
                      }}
                      disabled={query.page === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-bar-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                        />
                      </svg>
                    </button>
                    <p className="mx-2 font-light text-uos-gray">
                      Page {query.page} of{" "}
                      {Math.ceil(jobPostingsSearch.count / query.limit)}
                    </p>
                    <button
                      className="p-2 text-white transition-colors rotate-180 rounded-md bg-uos-purple h-min hover:bg-uos-purple-hover focus:outline-none disabled:bg-uos-lightgray "
                      onClick={() => {
                        setQuery({
                          ...query,
                          page: query.page + 1,
                        });
                      }}
                      disabled={
                        query.page >=
                        Math.ceil(jobPostingsSearch.count / query.limit)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-bar-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-white transition-colors rotate-180 rounded-md bg-uos-purple h-min hover:bg-uos-purple-hover focus:outline-none disabled:bg-uos-lightgray "
                      onClick={() => {
                        setQuery({
                          ...query,
                          page: Math.ceil(
                            jobPostingsSearch.count / query.limit
                          ),
                        });
                      }}
                      disabled={
                        query.page >=
                        Math.ceil(jobPostingsSearch.count / query.limit)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-bar-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0M4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {activeModal === "view_listing" && focusTarget && (
          <Modal
            onClick={() => {
              setActiveModal("");
              handleSearch();
            }}
            modalTitle="View Job Listing"
            key="view_listing"
          >
            <ViewListingModal
              closeModal={() => {
                setActiveModal("");
                handleSearch();
              }}
              targetListing={focusTarget}
            />
          </Modal>
        )}
      </AnimatePresence>
    </PageSkeleton>
  );
};

export default SearchListings;
