/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import UserModal from "../components/admin/UserModal";
import Modal from "../components/misc/Modal";
import PageSkeleton from "../utils/PageSkeleton";
import NewListingModal from "../components/staff/NewListingModal";
import DataCard from "../components/misc/DataCard";
import { useDispatch } from "react-redux";
import {
  useGetEndingSoonListingsQuery,
  useGetListingsQuery,
  useGetRecentListingsQuery,
  useGetStaffListingsEndingSoonPaginatedQuery,
  useGetStaffListingsPaginatedQuery,
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
import LoadingSpinner from "../components/misc/LoadingSpinner";

// Package Imports

// Component Imports

// Asset Imports

/**
 * Staff renders a React page.
 */
const BrowseListings = () => {
  const [activeTab, setActiveTab] = useState("staff_home");
  const [activeModal, setActiveModal] = useState("");
  const [activeModalInitialTab, setActiveModalInitialTab] = useState("");
  const [focusTarget, setFocusTarget] = useState<ListingTypePublic>();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: jobPostingsRecent,
    isLoading: isLoadingJobPostingsRecent,
    isSuccess: isSuccessJobPostingsRecent,
    isError: isErrorJobPostingsRecent,
    refetch: refetchJobPostingsRecent,
  } = useGetRecentListingsQuery(
    {
      page: 1,
      limit: 10,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: jobPostingsEndingSoon,
    isLoading: isLoadingJobPostingsEndingSoon,
    isSuccess: isSuccessJobPostingsEndingSoon,
    isError: isErrorJobPostingsEndingSoon,
    refetch: refetchJobPostingsEndingSoon,
  } = useGetEndingSoonListingsQuery(
    {
      page: 1,
      limit: 10,
    },
    { refetchOnMountOrArgChange: true }
  );
  // get job listings from the backend

  //   console.log("jobPostings: ", jobPostingsRecent);

  return (
    <PageSkeleton title="Browse Listings" heading="Browse Listings">
      <div className="grid w-full h-full max-w-6xl grid-cols-4 gap-8 mt-8">
        <button
          className="flex flex-col items-center col-span-4 px-4 py-8 transition-shadow bg-white shadow-lg gap-y-4 rounded-2xl hover:shadow-xl text-uos-gray"
          onClick={() => {
            navigate("/listings/search");
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
              Nothing catching your eye? Try filtering the results to find the
              best match for you!
            </p>
          </div>
        </button>
        <DataCard
          className="h-full col-span-2 min-h-72"
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
              {isLoadingJobPostingsRecent && <p>Loading...</p>}
              {isSuccessJobPostingsRecent &&
                !isErrorJobPostingsRecent &&
                jobPostingsRecent &&
                jobPostingsRecent.map((jobPosting: ListingTypePublic) => {
                  return (
                    <button
                      key={"recentListing_" + jobPosting._id}
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
                        <div className="flex flex-col text-sm ">
                          <p className="text-xs">Posted</p>
                          <p className="text-ellipsis">
                            {new Date(
                              jobPosting.dates.listingDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              {!isLoadingJobPostingsRecent &&
                jobPostingsRecent &&
                jobPostingsRecent.length === 0 && (
                  <p className="m-2 font-light text-uos-gray">
                    No listings found.
                  </p>
                )}
            </div>
          </div>
        </DataCard>
        <DataCard
          className="h-full col-span-2 min-h-48"
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
              {isLoadingJobPostingsEndingSoon && <LoadingSpinner />}
              {isSuccessJobPostingsEndingSoon &&
                !isErrorJobPostingsEndingSoon &&
                jobPostingsEndingSoon &&
                jobPostingsEndingSoon.map((jobPosting: ListingTypePublic) => {
                  return (
                    <button
                      key={"recentListing_" + jobPosting._id}
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
                        <div className="flex flex-row items-center gap-x-2">
                          <div className="flex flex-col text-sm ">
                            <p className="text-xs">
                              Clos
                              {new Date(jobPosting.dates.closingDate!) <
                              new Date()
                                ? "ed"
                                : "ing"}
                            </p>

                            <p className="text-ellipsis">
                              {new Date(
                                jobPosting.dates.closingDate!
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              {!isLoadingJobPostingsEndingSoon &&
                jobPostingsEndingSoon &&
                jobPostingsEndingSoon.length === 0 && (
                  <p className="m-2 font-light text-uos-gray">
                    No listings found.
                  </p>
                )}
            </div>
          </div>
        </DataCard>
      </div>
      <AnimatePresence>
        {activeModal === "view_listing" && focusTarget && (
          <Modal
            onClick={() => {
              setActiveModal("");
            }}
            modalTitle="View Job Listing"
            key="view_listing"
          >
            <ViewListingModal
              closeModal={() => {
                setActiveModal("");
                refetchJobPostingsEndingSoon();
              }}
              targetListing={focusTarget}
            />
          </Modal>
        )}
      </AnimatePresence>
    </PageSkeleton>
  );
};

export default BrowseListings;
