/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import UserModal from "../components/admin/UserModal";
import Modal from "../components/misc/Modal";
import PageSkeleton from "../utils/PageSkeleton";
import NewListingModal from "../components/staff/NewListingModal";
import DataCard from "../components/misc/DataCard";
import { useDispatch } from "react-redux";
import {
  useGetListingsQuery,
  useGetStaffListingsDashboardQuery,
  useGetStaffListingsEndingSoonPaginatedQuery,
  useGetStaffListingsJustEndedPaginatedQuery,
  useGetStaffListingsPaginatedQuery,
  useGetStaffListingsRecentPaginatedQuery,
} from "../redux/listings/listingsApiSlice";
import ListingType from "../types/ListingType";
import EditListingModal from "../components/staff/EditListingModal";
import ViewListingModal from "../components/staff/ViewListingModal";
import jobTypeStrings from "../utils/conversions/jobTypeStrings";
import contractTypeStrings from "../utils/conversions/contractTypeStrings";
import locationTypeStrings from "../utils/conversions/locationTypeStrings";
import workingPatternStrings from "../utils/conversions/workingPatternStrings";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/misc/LoadingSpinner";

// Package Imports

// Component Imports

// Asset Imports

/**
 * Staff renders a React page.
 */
const Staff = () => {
  const [activeTab, setActiveTab] = useState("staff_home");
  const [activeModal, setActiveModal] = useState("");
  const [activeModalInitialTab, setActiveModalInitialTab] =
    useState("listing_home");
  const [focusTarget, setFocusTarget] = useState<ListingType>();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { data, isLoading, isSuccess, isError, refetch } =
    useGetStaffListingsDashboardQuery({}, { refetchOnMountOrArgChange: false });

  // const {
  //   data: dataJobPostingsEndingSoon,
  //   isLoading: isLoadingJobPostingsEndingSoon,
  //   isSuccess: isSuccessJobPostingsEndingSoon,
  //   isError: isErrorJobPostingsEndingSoon,
  //   refetch: refetchJobPostingsEndingSoon,
  // } = useGetStaffListingsEndingSoonPaginatedQuery(
  //   {
  //     page: 1,
  //     limit: 10,
  //   },
  //   { refetchOnMountOrArgChange: false }
  // );
  // const [jobPostingsEndingSoon, setJobPostingsEndingSoon] = useState<
  //   ListingType[]
  // >([]);

  // const {
  //   data: dataJobPostingsRecent,
  //   isLoading: isLoadingJobPostingsRecent,
  //   isSuccess: isSuccessJobPostingsRecent,
  //   isError: isErrorJobPostingsRecent,
  //   refetch: refetchJobPostingsRecent,
  // } = useGetStaffListingsRecentPaginatedQuery(
  //   {
  //     page: 1,
  //     limit: 10,
  //   },
  //   { refetchOnMountOrArgChange: false }
  // );
  // const [jobPostingsRecent, setJobPostingsRecent] = useState<ListingType[]>([]);

  // const {
  //   data: dataJobPostingsJustEnded,
  //   isLoading: isLoadingJobPostingsJustEnded,
  //   isSuccess: isSuccessJobPostingsJustEnded,
  //   isError: isErrorJobPostingsJustEnded,
  //   refetch: refetchJobPostingsJustEnded,
  // } = useGetStaffListingsJustEndedPaginatedQuery(
  //   {
  //     page: 1,
  //     limit: 10,
  //   },
  //   { refetchOnMountOrArgChange: false }
  // );
  // const [jobPostingsJustEnded, setJobPostingsJustEnded] = useState<
  //   ListingType[]
  // >([]);

  // set all listing data to ending soon data for testing
  // const jobPostingsRecent = jobPostingsEndingSoon;
  // const isLoadingJobPostingsRecent = isLoadingJobPostingsEndingSoon;
  // const isSuccessJobPostingsRecent = isSuccessJobPostingsEndingSoon;
  // const isErrorJobPostingsRecent = isErrorJobPostingsEndingSoon;

  // const jobPostingsJustEnded = jobPostingsEndingSoon;
  // const isLoadingJobPostingsJustEnded = isLoadingJobPostingsEndingSoon;
  // const isSuccessJobPostingsJustEnded = isSuccessJobPostingsEndingSoon;
  // const isErrorJobPostingsJustEnded = isErrorJobPostingsEndingSoon;

  // const refetchAllListings = async () => {
  //   try {
  //     // await refetchJobPostingsEndingSoon();
  //     // await refetchJobPostingsRecent();
  //     // await refetchJobPostingsJustEnded();

  //     // console.log("refetching 1");
  //     // await setJobPostingsEndingSoon(await dataJobPostingsEndingSoon);
  //     // // use timeout
  //     // await new Promise((resolve) => setTimeout(resolve, 1000));
  //     // console.log("refetching 2");
  //     // await setJobPostingsRecent(await dataJobPostingsRecent);
  //     // await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // console.log("refetching 3");
  //     // await setJobPostingsJustEnded(await dataJobPostingsJustEnded);
  //     // await new Promise((resolve) => setTimeout(resolve, 1000));

  //     console.log("refetching 1");
  //     const dataEndingSoon = await dataJobPostingsEndingSoon;
  //     setJobPostingsEndingSoon(dataEndingSoon);

  //     console.log("refetching 2");
  //     const dataRecent = await dataJobPostingsRecent;
  //     setJobPostingsRecent(dataRecent);

  //     console.log("refetching 3");
  //     const dataJustEnded = await dataJobPostingsJustEnded;
  //     setJobPostingsJustEnded(dataJustEnded);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const [initialFetch, setInitialFetch] = useState(false);

  // useEffect(() => {
  //   console.log("initial fetch");

  //   if (initialFetch) {
  //     console.log("refetching all listings");

  //     refetchAllListings();
  //   } else {
  //     setInitialFetch(true);
  //   }
  // }, [initialFetch]);

  return (
    <PageSkeleton heading="Staff Dashboard">
      <div className="grid w-full h-full max-w-6xl grid-cols-4 gap-8 mt-8">
        <button
          className="flex flex-col items-center col-span-2 px-4 py-8 transition-shadow bg-white shadow-lg gap-y-4 rounded-2xl hover:shadow-xl text-uos-gray"
          onClick={() => {
            navigate("/staff/listings/search");
          }}
        >
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
          <div className="max-w-sm">
            <p className="text-sm font-light text-uos-gray">
              Can't find what you're looking for? Search and filter listings
              here.
            </p>
          </div>
        </button>
        <button
          className="flex flex-col items-center col-span-2 px-4 py-8 transition-shadow bg-white shadow-lg gap-y-4 rounded-2xl hover:shadow-xl text-uos-gray"
          onClick={() => {
            setActiveModal("staff_new_listing");
          }}
        >
          <div className="flex flex-row items-center justify-center w-full gap-x-4 ">
            <p className="text-3xl font-light ">New Listing</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-search text-uos-lightgray"
              viewBox="0 0 16 16"
            >
              <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5" />
              <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
            </svg>
          </div>
          <div className="max-w-sm">
            <p className="text-sm font-light text-uos-gray">
              Create a new job listing to attract applicants.
            </p>
          </div>
        </button>
        <DataCard
          className="col-span-2 h-72"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <div
            className="z-10 flex flex-col w-full h-full cursor-default"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="text-xl font-light text-left text-uos-gray">
              Listings Ending Soon
            </h2>
            <hr className="my-2" />
            <div className="overflow-y-auto ">
              {isLoading && <LoadingSpinner />}
              {isSuccess &&
                !isError &&
                data.endingSoon &&
                data.endingSoon.map((jobPosting: ListingType) => {
                  return (
                    <button
                      key={jobPosting._id}
                      className="flex flex-col items-center w-full px-2 py-1 font-light transition-colors gap-y-2 hover:bg-gray-50 focus:outline-none"
                      onClick={() => {
                        setFocusTarget(jobPosting);
                        setActiveModalInitialTab("listing_home");
                        setActiveModal("staff_view_listing");
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
                        {/* </div>
                      
                      <div className="flex flex-row items-center gap-2"> */}
                        <div className="flex flex-row items-center gap-x-2">
                          <div className="flex flex-col text-sm ">
                            <p className="text-xs">
                              Clos
                              {new Date(jobPosting.dates.closingDate) <
                              new Date()
                                ? "ed"
                                : "ing"}
                            </p>

                            <p className="text-ellipsis">
                              {new Date(
                                jobPosting.dates.closingDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusTarget(jobPosting);
                              setActiveModalInitialTab("listing_applicants");
                              setActiveModal("staff_view_listing");
                            }}
                            title="View Applicants"
                            className="transition text-uos-lightgray hover:text-uos-purple"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-file-earmark-text-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusTarget(jobPosting);
                              setActiveModal("staff_edit_listing");
                            }}
                            title="Edit Listing"
                            className="transition text-uos-lightgray hover:text-uos-purple"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor "
                              className="bi bi-pen"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })}
              {!isLoading && data && data.endingSoon.length === 0 && (
                <p className="m-2 font-light text-uos-gray">
                  No listings found.
                </p>
              )}
            </div>
          </div>
        </DataCard>
        <DataCard
          className="col-span-2 h-72"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <div
            className="z-10 flex flex-col w-full h-full cursor-default"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="text-xl font-light text-left text-uos-gray">
              Recently Posted
            </h2>
            <hr className="my-2" />
            <div className="overflow-y-auto ">
              {isLoading && <LoadingSpinner />}
              {isSuccess &&
                !isError &&
                data.recentPostings &&
                data.recentPostings.map((jobPosting: ListingType) => {
                  return (
                    <button
                      key={jobPosting._id}
                      className="flex flex-col items-center w-full px-2 py-1 font-light transition-colors hover:bg-gray-50 focus:outline-none"
                      onClick={() => {
                        setFocusTarget(jobPosting);
                        setActiveModalInitialTab("listing_home");
                        setActiveModal("staff_view_listing");
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
                        {/* </div>
                      
                      <div className="flex flex-row items-center gap-2"> */}
                        <div className="flex flex-row items-center gap-x-2">
                          <div className="flex flex-col text-sm ">
                            <p className="text-xs">Posted</p>
                            <p className="text-ellipsis">
                              {new Date(
                                jobPosting.dates.listingDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusTarget(jobPosting);
                              setActiveModalInitialTab("listing_applicants");
                              setActiveModal("staff_view_listing");
                            }}
                            title="View Applicants"
                            className="transition text-uos-lightgray hover:text-uos-purple"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-file-earmark-text-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusTarget(jobPosting);
                              setActiveModal("staff_edit_listing");
                            }}
                            title="Edit Listing"
                            className="transition text-uos-lightgray hover:text-uos-purple"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor "
                              className="bi bi-pen"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })}
              {!isLoading && data && data.recentPostings.length === 0 && (
                <p className="m-2 font-light text-uos-gray">
                  No listings found.
                </p>
              )}
            </div>
          </div>
        </DataCard>
        <DataCard
          className="col-span-2 h-72"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <div
            className="z-10 flex flex-col w-full h-full cursor-default"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="text-xl font-light text-left text-uos-gray">
              Just Ended
            </h2>
            <hr className="my-2" />
            <div className="overflow-y-auto ">
              {isLoading && <LoadingSpinner />}
              {isSuccess &&
                !isError &&
                data.justEnded &&
                data.justEnded.map((jobPosting: ListingType) => {
                  return (
                    <button
                      key={jobPosting._id}
                      className="flex flex-col items-center w-full px-2 py-1 font-light transition-colors hover:bg-gray-50 focus:outline-none"
                      onClick={() => {
                        setFocusTarget(jobPosting);
                        setActiveModalInitialTab("listing_home");
                        setActiveModal("staff_view_listing");
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
                        {/* </div>
                      
                      <div className="flex flex-row items-center gap-2"> */}
                        <div className="flex flex-row items-center gap-x-2">
                          <div className="flex flex-col text-sm ">
                            <p className="text-xs">Ended</p>
                            <p className="text-ellipsis">
                              {new Date(
                                jobPosting.dates.closingDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusTarget(jobPosting);
                              setActiveModalInitialTab("listing_applicants");
                              setActiveModal("staff_view_listing");
                            }}
                            title="View Applicants"
                            className="transition text-uos-lightgray hover:text-uos-purple"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-file-earmark-text-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusTarget(jobPosting);
                              setActiveModal("staff_edit_listing");
                            }}
                            title="Edit Listing"
                            className="transition text-uos-lightgray hover:text-uos-purple"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor "
                              className="bi bi-pen"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })}
              {!isLoading && data && data.justEnded.length === 0 && (
                <p className="m-2 font-light text-uos-gray">
                  No listings found.
                </p>
              )}
            </div>
          </div>
        </DataCard>
        <DataCard
          className="col-span-2 h-72"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <div
            className="z-10 flex flex-col w-full h-full cursor-default"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="text-xl font-light text-left text-uos-gray">
              Recently Added
            </h2>
            <hr className="my-2" />
            <div className="overflow-y-auto ">
              {isLoading && <LoadingSpinner />}
              {isSuccess && !isError && data.recentlyCreated.length > 0 ? (
                data.recentlyCreated.map((jobPosting: ListingType) => {
                  return (
                    <button
                      key={jobPosting._id}
                      className="flex flex-col items-center w-full px-2 py-1 font-light transition-colors hover:bg-gray-50 focus:outline-none"
                      onClick={() => {
                        setFocusTarget(jobPosting);
                        setActiveModalInitialTab("listing_home");
                        setActiveModal("staff_view_listing");
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
                        {/* </div>
                      
                      <div className="flex flex-row items-center gap-2"> */}
                        <div className="flex flex-row items-center gap-x-2">
                          <div className="flex flex-col text-sm ">
                            <p className="text-xs">Added</p>
                            <p className="text-ellipsis">
                              {new Date(
                                jobPosting.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusTarget(jobPosting);
                              setActiveModalInitialTab("listing_applicants");
                              setActiveModal("staff_view_listing");
                            }}
                            title="View Applicants"
                            className="transition text-uos-lightgray hover:text-uos-purple"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-file-earmark-text-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusTarget(jobPosting);
                              setActiveModal("staff_edit_listing");
                            }}
                            title="Edit Listing"
                            className="transition text-uos-lightgray hover:text-uos-purple"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor "
                              className="bi bi-pen"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="m-2 font-light text-uos-gray">
                  No new notifications.
                </p>
              )}
            </div>
          </div>
        </DataCard>
      </div>
      <AnimatePresence>
        {activeModal === "staff_new_listing" && (
          <Modal
            onClick={() => {
              setActiveModal("");
            }}
            modalTitle="New Job Listing"
            key="staff_new_listing"
          >
            <NewListingModal
              closeModal={() => {
                //refresh data
                setActiveModal("");
                refetch();
              }}
            />
          </Modal>
        )}
        {activeModal === "staff_edit_listing" && focusTarget && (
          <Modal
            onClick={() => {
              setActiveModal("");
            }}
            modalTitle="Edit Job Listing"
            key="staff_edit_listing"
          >
            <EditListingModal
              closeModal={() => {
                //refresh data
                setActiveModal("");
                refetch();
              }}
              targetListing={focusTarget}
            />
          </Modal>
        )}
        {activeModal === "staff_view_listing" && focusTarget && (
          <Modal
            onClick={() => {
              setActiveModal("");
            }}
            modalTitle="View Job Listing"
            key="staff_view_listing"
          >
            <ViewListingModal
              closeModal={() => {
                setActiveModal("");
                refetch();
              }}
              targetListing={focusTarget}
              initialTab={activeModalInitialTab}
            />
          </Modal>
        )}
      </AnimatePresence>
    </PageSkeleton>
  );
};

export default Staff;
