/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useEffect, useState } from "react";
import { useGetApplicationFromListingQuery } from "../../redux/application/applicationApiSlice";
import ListingTypePublic from "../../types/ListingTypePublic";
import ProfileType from "../../types/ProfileType";
import ApplicationType from "../../types/ApplicationType";
import LoadingSpinner from "../misc/LoadingSpinner";
import { AnimatePresence } from "framer-motion";
import DataPoint from "./DataPoint";
import resourceTypeStrings from "../../utils/conversions/resourceTypeStrings";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { tailwindCustomProseClass } from "../../utils/constants";
import reasonForLeavingStrings from "../../utils/conversions/reasonForLeavingStrings";
import DataRow from "../misc/DataRow";

// Package Imports

// Component Imports

// Asset Imports

export type ViewApplicationModalProps = {
  className?: string;
  targetListing: ListingTypePublic;
};

/**
 * ViewApplicationModal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const ViewApplicationModal = ({
  className,
  targetListing,
}: ViewApplicationModalProps) => {
  // data will be ApplicationType
  const { data, error, isLoading } = useGetApplicationFromListingQuery({
    listingId: targetListing._id,
  });

  const [applicationData, setApplicationData] = useState<ApplicationType>();

  useEffect(() => {
    if (data) {
      setApplicationData(data);
    }
  }, [data]);

  console.log(data);

  return (
    <div className={`${className}`}>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingSpinner />}
        {error && <p>Error: {error}</p>}
        {!isLoading && applicationData && (
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

            <p className="mt-4 font-light text-uos-gray">
              Application ID:{" "}
              <span className="italic">{applicationData._id}</span>
            </p>
            <p className="font-light text-uos-gray">
              Application Submitted:{" "}
              <span className="italic">
                {new Date(applicationData.createdAt).toLocaleDateString()}
              </span>
            </p>
            <div className="grid w-full grid-cols-4 gap-4">
              <div className="col-span-4">
                <hr className="my-4" />
                <h2 className="text-lg font-semibold text-uos-gray">
                  Application Status
                </h2>
              </div>
              <div className="flex flex-row flex-wrap items-start justify-start col-span-4 gap-x-4 gap-y-2">
                {applicationData.flags && (
                  <DataPoint
                    title="Flags"
                    content={
                      applicationData.flags === "Action Required"
                        ? "Action Required (check email)"
                        : applicationData.flags
                    }
                    className={
                      applicationData.flags === "Action Required"
                        ? "border-red-600"
                        : ""
                    }
                  />
                )}
                <DataPoint
                  title="Status"
                  content={
                    (applicationData.statusInt < 5 && "Pending") ||
                    (applicationData.statusInt < 10 && "Accepted") ||
                    (applicationData.statusInt < 15 && "Rejected") ||
                    "Unknown"
                  }
                  className="col-span-1"
                />
                {applicationData.statusInfo && (
                  <DataPoint
                    title="Status Info"
                    content={applicationData.statusInfo}
                    className="col-span-3"
                  />
                )}
                <DataPoint
                  title="Last Update"
                  content={
                    new Date(applicationData.updatedAt).toLocaleDateString() +
                    " at " +
                    new Date(applicationData.updatedAt).toLocaleTimeString()
                  }
                  className="col-span-2"
                />
              </div>

              <div className="col-span-4">
                <hr className="my-4" />
                <h2 className="text-lg font-semibold text-uos-gray">
                  Application Details
                </h2>
                <p className="font-light text-uos-gray">
                  If any of these details are incorrect, please contact us as
                  soon as possible so we can update your application.
                </p>
              </div>
              <div className="flex flex-col col-span-2 gap-y-4">
                <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                  <p className="mb-2 text-lg font-semibold text-uos-gray">
                    Personal Details
                  </p>
                  <DataRow
                    title="First Name"
                    content={applicationData.profile.names.first}
                    className=""
                  />
                  <DataRow
                    title="Last Name"
                    content={applicationData.profile.names.last}
                    className=""
                  />
                  {applicationData.profile.names.other && (
                    <DataRow
                      title="Other Names"
                      content={applicationData.profile.names.other}
                      className=""
                    />
                  )}
                  {applicationData.profile.contactDetails.email && (
                    <DataRow
                      title="Email"
                      content={applicationData.profile.contactDetails.email}
                      className=""
                    />
                  )}
                  {applicationData.profile.contactDetails.phone && (
                    <DataRow
                      title="Phone"
                      content={applicationData.profile.contactDetails.phone}
                      className=""
                    />
                  )}
                  <hr className="my-2" />
                  <DataRow
                    title="House"
                    content={applicationData.profile.address.house}
                    className=""
                  />
                  <DataRow
                    title="Street"
                    content={applicationData.profile.address.street}
                    className=""
                  />
                  <DataRow
                    title="City"
                    content={applicationData.profile.address.city}
                    className=""
                  />
                  <DataRow
                    title="Country"
                    content={applicationData.profile.address.country}
                    className=""
                  />
                  <DataRow
                    title="Postcode"
                    content={applicationData.profile.address.postcode}
                    className=""
                  />
                </div>
                {applicationData.profile.education &&
                  applicationData.profile.education.length > 0 && (
                    <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                      <p className="mb-2 text-lg font-semibold text-uos-gray">
                        Education
                      </p>
                      {applicationData.profile.education.map(
                        (education, index) => (
                          <div key={index} className="">
                            {education.institution && (
                              <DataRow
                                title="Institution"
                                content={education.institution}
                                className=""
                              />
                            )}
                            {education.qualification && (
                              <DataRow
                                title="Qualification"
                                content={education.qualification}
                                className=""
                              />
                            )}
                            {education.subject && (
                              <DataRow
                                title="Subject"
                                content={education.subject}
                                className=""
                              />
                            )}
                            {education.grade && (
                              <DataRow
                                title="Grade"
                                content={education.grade}
                                className=""
                              />
                            )}
                            {education.country && (
                              <DataRow
                                title="Country"
                                content={education.country}
                                className=""
                              />
                            )}
                            {education.period.start && (
                              <DataRow
                                title="Start Date"
                                content={new Date(
                                  education.period.start
                                ).toLocaleDateString()}
                                className=""
                              />
                            )}
                            {education.period.end && (
                              <DataRow
                                title="End Date"
                                content={new Date(
                                  education.period.end
                                ).toLocaleDateString()}
                                className=""
                              />
                            )}
                            {index <
                              applicationData.profile.education.length - 1 && (
                              <hr className="my-2" />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                {applicationData.profile.workExperience &&
                  applicationData.profile.workExperience.length > 0 && (
                    <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                      <p className="mb-2 text-lg font-semibold text-uos-gray">
                        Work Experience
                      </p>
                      {applicationData.profile.workExperience.map(
                        (experience, index) => (
                          <div key={index} className="">
                            {experience.jobTitle && (
                              <DataRow
                                title="Job Title"
                                content={experience.jobTitle}
                                className=""
                              />
                            )}
                            {experience.company && (
                              <DataRow
                                title="Company"
                                content={experience.company}
                                className=""
                              />
                            )}
                            {experience.period.start && (
                              <DataRow
                                title="Start Date"
                                content={new Date(
                                  experience.period.start
                                ).toLocaleDateString()}
                                className=""
                              />
                            )}
                            {experience.period.end && (
                              <DataRow
                                title="End Date"
                                content={new Date(
                                  experience.period.end
                                ).toLocaleDateString()}
                                className=""
                              />
                            )}
                            {experience.country && (
                              <DataRow
                                title="Country"
                                content={experience.country}
                                className=""
                              />
                            )}
                            {experience.salary && (
                              <DataRow
                                title="Salary"
                                content={
                                  "£" + experience.salary.toLocaleString()
                                }
                                className=""
                              />
                            )}
                            {experience.noticePeriod && (
                              <DataRow
                                title="Notice Period"
                                content={experience.noticePeriod}
                                className=""
                              />
                            )}
                            {experience.reasonForLeaving && (
                              <DataRow
                                title="Reason for Leaving"
                                content={
                                  reasonForLeavingStrings[
                                    experience.reasonForLeaving
                                  ]
                                }
                                className=""
                              />
                            )}
                            {index <
                              applicationData.profile.workExperience.length -
                                1 && <hr className="my-2" />}
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
              <div className="flex flex-col col-span-2 gap-y-4">
                <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                  <p className="mb-2 text-lg font-semibold text-uos-gray">
                    Questionnaire Answers
                  </p>
                  <DataRow
                    title="Unspent Convictions"
                    content={
                      applicationData.profile.questionnaireAnswers
                        .c_criminalConvictions.q_unspentConvictions
                        ? "Yes"
                        : "No"
                    }
                    className=""
                  />
                  <DataRow
                    title="Spent Convictions"
                    content={
                      applicationData.profile.questionnaireAnswers
                        .c_criminalConvictions.q_spentConvictions
                        ? "Yes"
                        : "No"
                    }
                    className=""
                  />
                  <DataRow
                    title="Details"
                    content={
                      applicationData.profile.questionnaireAnswers
                        .c_criminalConvictions.q_additionalInformation ||
                      "Not Provided"
                    }
                    className=""
                  />
                  <hr className="my-2" />
                  <DataRow
                    title="Disability Consideration"
                    content={
                      applicationData.profile.questionnaireAnswers.c_disability
                        .q_disability
                        ? "Yes"
                        : "No"
                    }
                    className=""
                  />
                  <DataRow
                    title="Details"
                    content={
                      applicationData.profile.questionnaireAnswers.c_disability
                        .q_additionalInformation || "Not Provided"
                    }
                    className=""
                  />
                  <hr className="my-2" />
                  <DataRow
                    title="Eligibility to Work"
                    content={
                      applicationData.profile.questionnaireAnswers
                        .c_eligibilityToWork.q_eligibilityToWork
                        ? "Yes"
                        : "No"
                    }
                    className=""
                  />
                  <DataRow
                    title="Details"
                    content={
                      applicationData.profile.questionnaireAnswers
                        .c_eligibilityToWork.q_additionalInformation ||
                      "Not Provided"
                    }
                    className=""
                  />
                  <DataRow
                    title="Visa Expires"
                    content={
                      applicationData.profile.questionnaireAnswers
                        .c_eligibilityToWork.q_visaInformation
                        ? new Date(
                            applicationData.profile.questionnaireAnswers.c_eligibilityToWork.q_visaInformation
                          ).toLocaleDateString()
                        : "Not Provided"
                    }
                    className=""
                  />
                </div>
                {applicationData.profile.questionnaireAnswers.c_references &&
                  applicationData.profile.questionnaireAnswers.c_references
                    .length > 0 && (
                    <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                      <p className="mb-2 text-lg font-semibold text-uos-gray">
                        References
                      </p>
                      {applicationData.profile.questionnaireAnswers.c_references.map(
                        (reference, index) => (
                          <div key={index} className="">
                            {reference.name && (
                              <DataRow
                                title="Name"
                                content={reference.name}
                                className=""
                              />
                            )}
                            {reference.jobTitle && (
                              <DataRow
                                title="Job Title"
                                content={reference.jobTitle}
                                className=""
                              />
                            )}
                            {reference.nameOfEmployer && (
                              <DataRow
                                title="Employer"
                                content={reference.nameOfEmployer}
                                className=""
                              />
                            )}
                            {reference.relationship && (
                              <DataRow
                                title="Relationship"
                                content={reference.relationship}
                                className=""
                              />
                            )}
                            {reference.contactDetails && (
                              <div className="">
                                {reference.contactDetails.email && (
                                  <DataRow
                                    title="Email"
                                    content={reference.contactDetails.email}
                                    className=""
                                  />
                                )}
                                {reference.contactDetails.phone && (
                                  <DataRow
                                    title="Phone"
                                    content={reference.contactDetails.phone}
                                    className=""
                                  />
                                )}
                              </div>
                            )}
                            <DataRow
                              title="Can Contact"
                              content={reference.canContact ? "Yes" : "No"}
                              className=""
                            />
                            {index <
                              applicationData.profile.questionnaireAnswers
                                .c_references.length -
                                1 && <hr className="my-2" />}
                          </div>
                        )
                      )}
                    </div>
                  )}
                {applicationData.profile.savedResources &&
                  applicationData.profile.savedResources.length > 0 && (
                    <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                      <p className="mb-2 text-lg font-semibold text-uos-gray">
                        Attachments
                      </p>
                      {applicationData.profile.savedResources.map(
                        (resource, index) => (
                          <div key={index} className="">
                            {resource.resourceTitle && (
                              <DataRow
                                title="Attachment Title"
                                content={resource.resourceTitle}
                                className=""
                              />
                            )}
                            {resource.resourceType && (
                              <DataRow
                                title="Type"
                                content={
                                  resourceTypeStrings[resource.resourceType]
                                }
                                className=""
                              />
                            )}
                            {resource.resourceDescription && (
                              <DataRow
                                title="Description"
                                content={resource.resourceDescription}
                                className=""
                              />
                            )}
                            {resource.resourceLink && (
                              <DataRow
                                title="URL"
                                content={resource.resourceLink}
                                className=""
                                link
                              />
                            )}
                            {index <
                              applicationData.profile.savedResources.length -
                                1 && <hr className="my-2" />}
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
              <div className="col-span-4">
                <hr className="my-4" />
                <h2 className="text-lg font-semibold text-uos-gray">
                  Additional Information
                </h2>
              </div>
              {applicationData.textContent && (
                <MarkdownEditor.Markdown
                  source={applicationData.textContent || ""}
                  className={`col-span-4 ${tailwindCustomProseClass}`}
                />
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewApplicationModal;
