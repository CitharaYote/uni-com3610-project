/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useState } from "react";
import ListingType from "../../types/ListingType";
import { AnimatePresence, motion } from "framer-motion";
import DataPoint from "../listings/DataPoint";
import jobTypeStrings from "../../utils/conversions/jobTypeStrings";
import contractTypeStrings from "../../utils/conversions/contractTypeStrings";
import workingPatternStrings from "../../utils/conversions/workingPatternStrings";
import locationTypeStrings from "../../utils/conversions/locationTypeStrings";
import currencySymbols from "../../utils/conversions/currencySymbols";
import proRataStrings from "../../utils/conversions/proRataStrings";
import Markdown from "react-markdown";
import { tailwindCustomProseClass } from "../../utils/constants";
import MarkdownEditor from "@uiw/react-markdown-editor";
import ListingTypePublic from "../../types/ListingTypePublic";
import RenderWithAuth from "../auth/RenderWithAuth";
import {
  useGetIsSavedQuery,
  useSaveListingToUserMutation,
} from "../../redux/profile/profileApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import ApplicationModal from "../application/ApplicationModal";
import RequireAuth from "../auth/RequireAuth";
import ViewApplicationModal from "./ViewApplicationModal";

// Package Imports

// Component Imports

// Asset Imports

export type ViewListingModalProps = {
  className?: string;
  closeModal: () => void;
  targetListing: ListingTypePublic;
};

/**
 * ViewListingModal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const ViewListingModal = ({
  className,
  closeModal,
  targetListing,
}: ViewListingModalProps) => {
  console.log("targetListing: ", targetListing);

  // get the current user from the redux store
  const currentUser = useSelector(selectCurrentUser);

  const navigate = useNavigate();

  const {
    data: isSaved,
    isLoading: isSavedLoading,
    isError: isSavedError,
    refetch: refetchIsSaved,
  } = useGetIsSavedQuery({ _id: targetListing._id });

  const [activeTab, setActiveTab] = useState("listing_home");
  const [savedCache, setSavedCache] = useState(isSaved ? isSaved : []);

  const [saveListingToUser] = useSaveListingToUserMutation();

  const handleSaveListing = async () => {
    // console.log("currentUser: ", currentUser);
    // console.log("isSaved: ", isSaved.saved);
    // console.log("isApplied: ", isSaved.applied);

    if (targetListing) {
      await saveListingToUser({ _id: targetListing._id });
      //   console.log("res 321: ", res.data.action);
      await refetchIsSaved();
    }
    // console.log("2");

    // console.log("isSaved: ", isSaved);
  };

  return (
    <div className={`${className} w-full pb-8`}>
      <div className="flex flex-row items-center justify-between w-full text-lg font-light border-b">
        <button
          className={`py-4 ${activeTab === "listing_home" ? "bg-gray-100  border-uos-purple" : "hover:bg-gray-50"} border-b transition w-full focus:outline-none hover:shadow-sm`}
          onClick={() => setActiveTab("listing_home")}
        >
          Listing Details
        </button>
        {!currentUser && (
          <button
            className={`py-4 ${activeTab === "listing_apply" ? "bg-gray-100  border-uos-purple" : "hover:bg-gray-50"} border-b transition w-full focus:outline-none hover:shadow-sm`}
            onClick={() => setActiveTab("listing_apply")}
          >
            Apply
          </button>
        )}
        {currentUser && (
          <RenderWithAuth
            fallback={
              <button
                className={`py-4 ${activeTab === "listing_apply" ? "bg-gray-100  border-uos-purple" : "hover:bg-gray-50"} border-b transition w-full focus:outline-none hover:shadow-sm`}
                onClick={() => setActiveTab("listing_apply")}
              >
                Apply
              </button>
            }
          >
            <button
              className={`py-4 ${activeTab === "listing_apply" || activeTab === "application_view" ? "bg-gray-100  border-uos-purple" : "hover:bg-gray-50"} border-b transition w-full  focus:outline-none hover:shadow-sm`}
              onClick={() =>
                setActiveTab(
                  !isSavedLoading && isSaved.applied
                    ? "application_view"
                    : "listing_apply"
                )
              }
            >
              {!isSavedLoading && isSaved.applied
                ? "Your Application"
                : "Apply"}
            </button>
          </RenderWithAuth>
        )}
        {currentUser && (
          <RenderWithAuth>
            <button
              className={`py-4 ${!isSavedLoading && isSaved.saved && " border-uos-purple"} hover:bg-gray-50 border-b transition w-full  focus:outline-none hover:shadow-sm flex flex-row items-center justify-center gap-x-2`}
              onClick={() => {
                handleSaveListing();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-bookmark text-uos-lightgray"
                viewBox="0 0 16 16"
              >
                {!isSavedLoading && isSaved.saved ? (
                  <path
                    fillRule="evenodd"
                    d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5M6 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"
                  />
                ) : (
                  <>
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4" />
                  </>
                )}
              </svg>
              {!isSavedLoading && isSaved.saved ? "Unsave" : "Save"}
            </button>
          </RenderWithAuth>
        )}
      </div>
      <AnimatePresence mode="wait">
        {activeTab === "listing_home" && (
          <motion.div
            className="w-full p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="home"
          >
            {targetListing ? (
              <div>
                <div className="flex flex-row items-end justify-between w-full gap-x-8">
                  <div>
                    <h1 className="text-3xl text-uos-darkgray line-clamp-2">
                      {targetListing.title}
                    </h1>
                    {targetListing.reference && (
                      <p className="text-lg font-light text-uos-gray">
                        Reference: {targetListing.reference}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="italic font-light text-uos-gray whitespace-nowrap">
                      Posted{" "}
                      {new Date(
                        targetListing.dates.listingDate
                      ).toLocaleDateString()}
                    </p>
                    <p className="italic font-light text-uos-gray whitespace-nowrap">
                      {targetListing.dates.closingDate
                        ? "Closing " +
                          new Date(
                            targetListing.dates.closingDate
                          ).toLocaleDateString()
                        : "No Closing Date"}
                    </p>
                  </div>
                </div>
                {(targetListing.tags.map(
                  // filter all non-empty tags
                  (tag) => tag.trim().length === 0
                ).length > 0 ||
                  (targetListing.dates.closingDate &&
                    new Date(targetListing.dates.closingDate).getTime() -
                      new Date().getTime() <
                      604800000)) && (
                  <div className="flex flex-row flex-wrap items-center gap-2 pt-2 mt-2">
                    {targetListing.dates.closingDate &&
                      new Date(targetListing.dates.closingDate).getTime() -
                        new Date().getTime() <
                        604800000 && (
                        <span className="px-2 py-1 text-sm text-white rounded-md bg-uos-purple whitespace-nowrap">
                          Closing Soon
                        </span>
                      )}
                    {
                      // if Trending tag exists
                      targetListing.tags.includes("Trending") && (
                        <span
                          className={`flex flex-row items-center px-2 py-[3px] text-sm bg-gray-100 rounded-md gap-x-1 text-uos-purple whitespace-nowrap border-uos-purple border`}
                        >
                          Trending
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-fire "
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15" />
                          </svg>
                        </span>
                      )
                    }
                    {targetListing.tags.map(
                      // filter all non-empty tags
                      (tag) => tag.trim().length > 0
                    ).length > 0 &&
                      targetListing.tags.map(
                        (tag, index) =>
                          // filter all non-empty tags
                          tag.trim().length > 0 &&
                          tag !== "Trending" && (
                            <span
                              key={tag + index}
                              className={`flex flex-row items-center px-2 py-1 text-sm bg-gray-100 rounded-md gap-x-1 text-uos-gray whitespace-nowrap `}
                            >
                              {tag}
                            </span>
                          )
                      )}
                  </div>
                )}
                {/* add a Closing Soon tag if the closing date exists and is within a week */}

                <hr className="my-4" />
                <div className="flex flex-row flex-wrap items-start justify-start gap-x-4 gap-y-2">
                  {/* <div className="grid grid-cols-4 gap-x-4 gap-y-6"> */}
                  {targetListing.jobType && (
                    <DataPoint
                      className="col-span-2"
                      title="Job Type"
                      content={jobTypeStrings[targetListing.jobType]}
                    />
                  )}
                  {targetListing.contractType && (
                    <DataPoint
                      title="Contract Type"
                      content={contractTypeStrings[targetListing.contractType]}
                    />
                  )}
                  {targetListing.workingPattern && (
                    <DataPoint
                      title="Working Pattern"
                      content={
                        workingPatternStrings[targetListing.workingPattern]
                      }
                    />
                  )}
                  {targetListing.faculty && (
                    <DataPoint
                      className="col-span-2"
                      title="Faculty"
                      content={targetListing.faculty}
                    />
                  )}
                  {targetListing.department && (
                    <DataPoint
                      className="col-span-2"
                      title="Department"
                      content={targetListing.department}
                    />
                  )}
                  {targetListing.location.remote && (
                    <DataPoint
                      title="Location"
                      content={
                        targetListing.location.locationName
                          ? targetListing.location.locationName +
                            " (" +
                            locationTypeStrings[targetListing.location.remote] +
                            ")"
                          : locationTypeStrings[targetListing.location.remote]
                      }
                    />
                  )}
                  {targetListing.salary && targetListing.salary.min && (
                    <DataPoint
                      className={`
                        ${
                          targetListing.salary.max &&
                          targetListing.salary.potentialMax
                            ? "col-span-3"
                            : targetListing.salary.max ||
                                targetListing.salary.potentialMax
                              ? "col-span-2"
                              : "col-span-1"
                        }
                      `}
                      title={`Salary`}
                      content={
                        (targetListing.salary.min ===
                          targetListing.salary.max || !targetListing.salary.max
                          ? currencySymbols[targetListing.salary.currency] +
                            targetListing.salary.min.toLocaleString()
                          : currencySymbols[targetListing.salary.currency] +
                            targetListing.salary.min.toLocaleString() +
                            " - " +
                            currencySymbols[targetListing.salary.currency] +
                            targetListing.salary.max?.toLocaleString()) +
                        (targetListing.salary.proRata
                          ? " pro rata"
                          : " per annum") +
                        (targetListing.salary.potentialMax
                          ? " (potential max of " +
                            currencySymbols[targetListing.salary.currency] +
                            targetListing.salary.potentialMax.toLocaleString() +
                            ")"
                          : "")
                      }
                    />
                  )}
                </div>
                <hr className="my-4" />
                <div className="w-full mt-8">
                  {/* <Markdown className={tailwindCustomProseClass}>
                    {targetListing.description}
                  </Markdown> */}
                  <MarkdownEditor.Markdown
                    className="markdown"
                    source={targetListing.description}
                  />
                </div>
              </div>
            ) : (
              <h1 className="text-2xl text-uos-darkgray">No Listing Found</h1>
            )}
          </motion.div>
        )}
        {activeTab === "listing_apply" && (
          <motion.div
            className="w-full p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="apply"
          >
            <RenderWithAuth
              fallback={
                <>
                  <h1 className="text-2xl text-uos-darkgray">
                    You must be logged in to apply for this listing
                  </h1>
                  <button
                    className="px-4 py-2 mt-4 text-white rounded-md bg-uos-purple focus:outline-none"
                    onClick={() => {
                      navigate("/auth/login");
                    }}
                  >
                    Login
                  </button>
                </>
              }
            >
              <ApplicationModal targetListing={targetListing} />
            </RenderWithAuth>
          </motion.div>
        )}
        {activeTab === "application_view" && (
          <motion.div
            className="w-full p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="application"
          >
            <RequireAuth>
              <ViewApplicationModal targetListing={targetListing} />
            </RequireAuth>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewListingModal;
