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
import { useGetStaffApplicationNumberFromListingQuery } from "../../redux/listings/listingsApiSlice";
import LoadingSpinner from "../misc/LoadingSpinner";
import ViewApplicantsModal from "./ViewApplicantsModal";

// Package Imports

// Component Imports

// Asset Imports

export type ViewListingModalProps = {
  className?: string;
  closeModal: () => void;
  targetListing: ListingType;
  initialTab?: "listing_home" | "listing_applicants";
};

/**
 * ViewListingModal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const ViewListingModal = ({
  className,
  closeModal,
  targetListing,
  initialTab = "listing_home",
}: ViewListingModalProps) => {
  const [activeTab, setActiveTab] = useState(initialTab); // listing_home shows listing info, listing_applicants shows applicants for the listing
  // TODO: get applicant number from backend
  const applicantNumber = 13; // placeholder

  // console.log(targetListing.description);

  const { data: applicantNumberData, isLoading: applicantNumberLoading } =
    useGetStaffApplicationNumberFromListingQuery({
      _id: targetListing._id,
    });

  return (
    <div className={`${className} w-full pb-8`}>
      <div className="flex flex-row items-center justify-between w-full text-lg font-light border-b">
        <button
          className={`py-4 ${activeTab === "listing_home" ? "bg-gray-100  border-uos-purple" : "hover:bg-gray-50"} border-b transition w-full focus:outline-none hover:shadow-sm`}
          onClick={() => setActiveTab("listing_home")}
        >
          Listing Details
        </button>
        <button
          className={`py-4 ${activeTab === "listing_applicants" ? "bg-gray-100  border-uos-purple" : "hover:bg-gray-50"} border-b transition w-full h-full focus:outline-none hover:shadow-sm`}
          onClick={() => setActiveTab("listing_applicants")}
        >
          {applicantNumberLoading ? (
            <LoadingSpinner className="my-auto h-7" />
          ) : applicantNumberData ? (
            `Applicants (${applicantNumberData})`
          ) : (
            `Applicants (0)`
          )}
        </button>
      </div>
      <AnimatePresence mode="wait">
        {activeTab === "listing_home" && (
          <motion.div
            className="w-full p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                        ? "Clos" +
                          (new Date(targetListing.dates.closingDate) >
                          new Date()
                            ? "ing "
                            : "ed ") +
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
                    {targetListing.tags.map(
                      // filter all non-empty tags
                      (tag) => tag.trim().length > 0
                    ).length > 0 &&
                      targetListing.tags.map(
                        (tag, index) =>
                          // filter all non-empty tags
                          tag.trim().length > 0 && (
                            <span
                              key={tag + index}
                              className="px-2 py-1 text-sm bg-gray-100 rounded-md text-uos-gray whitespace-nowrap"
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
                  {targetListing.salary.min && (
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
                      title={`Salary${
                        targetListing.salary.hidden ? " (Hidden)" : ""
                      }`}
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
        {activeTab === "listing_applicants" && (
          <motion.div
            className="w-full p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="applicants_modal"
          >
            <ViewApplicantsModal targetListing={targetListing} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewListingModal;
