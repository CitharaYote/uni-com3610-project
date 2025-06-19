/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useEffect, useState } from "react";
import {
  useAssignStaffToPanelMutation,
  useGetPanelMembersQuery,
  useGetStaffApplicationsFromListingQuery,
  useSetRankingMutation,
  useUpdateApplicationStatusMutation,
} from "../../redux/listings/listingsApiSlice";
import LoadingSpinner from "../misc/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";
import ApplicationType from "../../types/ApplicationType";
import statusIntStrings from "../../utils/conversions/statusIntStrings";
import { tailwindCustomProseClass } from "../../utils/constants";
import MarkdownEditor from "@uiw/react-markdown-editor";
import DataRow from "../misc/DataRow";
import resourceTypeStrings from "../../utils/conversions/resourceTypeStrings";
import reasonForLeavingStrings from "../../utils/conversions/reasonForLeavingStrings";
import DataPoint from "../listings/DataPoint";
import { useSelector } from "react-redux";
import {
  selectCurrentRoles,
  selectCurrentUser,
  selectCurrentUserId,
} from "../../redux/auth/authSlice";
import ListingType from "../../types/ListingType";
import TextInputBox from "../misc/TextInputBox";
import { useError } from "../common/ErrorDisplay";
import SelectInputBox from "../misc/SelectInputBox";

// Package Imports

// Component Imports

// Asset Imports

export type ViewApplicantsModalProps = {
  className?: string;
  targetListing?: ListingType;
  targetApplication?: ApplicationType;
};

const RankingPanel = ({
  className,
  targetListing,
  targetApplication,
  refetchApplications,
}: {
  className: string;
  targetListing: ListingType;
  targetApplication: ApplicationType;
  refetchApplications: () => void;
}) => {
  const user = useSelector(selectCurrentUser);
  const roles = useSelector(selectCurrentRoles);
  const handleError = useError();

  const [panelMemberUsername, setPanelMemberUsername] = useState("");
  const [userRanking, setUserRanking] = useState({
    // staffMemberUsername: "",
    ranking: -1,
    comments: "",
  });
  const [userRankingNumber, setUserRankingNumber] = useState("");

  const [applicationStatusInt, setApplicationStatusInt] = useState(
    targetApplication?.statusInt
  );

  const [
    updateApplicationStatus,
    {
      isLoading: isLoadingUpdateApplicationStatus,
      isError: isErrorUpdateApplicationStatus,
    },
  ] = useUpdateApplicationStatusMutation();

  useEffect(() => {
    setUserRanking({
      ...userRanking,
      ranking: userRankingNumber === "" ? -1 : parseInt(userRankingNumber),
    });
  }, [userRankingNumber]);

  // stores the panel members in a cache until a fetch is made
  const [panelMembersCache, setPanelMembersCache] = useState<string[]>([]);

  const [
    assignStaffToPanel,
    {
      isLoading: isLoadingAssignStaffToPanel,
      isError: isErrorAssignStaffToPanel,
    },
  ] = useAssignStaffToPanelMutation();

  const [
    setRanking,
    { isLoading: isLoadingSetRanking, isError: isErrorSetRanking },
  ] = useSetRankingMutation();

  const {
    data: dataPanelMembers,
    isLoading: isLoadingPanelMembers,
    isError: isErrorPanelMembers,
    refetch: refetchPanelMembers,
  } = useGetPanelMembersQuery({
    _id: targetListing?._id,
  });

  console.log("targetListing.postedBy: ", targetListing?.postedBy);
  console.log("user: ", user);
  console.log("equals: ", user === targetListing?.postedBy);

  console.log("panelMembers" + dataPanelMembers);

  // console.log("isErrorAssignStaffToPanel: ", isErrorAssignStaffToPanel);

  const handleAssignStaffToPanel = async () => {
    console.log("!!!!!assigning staff to panel");

    const res = await assignStaffToPanel({
      _id: targetListing?._id,
      username: panelMemberUsername,
    });

    console.log("res: ", res);

    if (res.error) {
      console.log("Error assigning staff to panel: ", res.error);
      handleError.showError({
        title: "Error assigning staff to panel",
        message: res.error.data.message,
      });
    } else {
      console.log("Staff assigned to panel: ", res.data);
      setPanelMembersCache([...panelMembersCache, panelMemberUsername]);
      await refetchPanelMembers();
    }
  };

  const assignRanking = async () => {
    console.log("assigning ranking");

    const res = await setRanking({
      jobPostingId: targetListing?._id,
      applicationId: targetApplication?._id,
      ranking: userRanking,
    });

    if (res.error) {
      console.log("Error assigning ranking: ", res.error);
      handleError.showError({
        title: "Error assigning ranking",
        message: res.error.data.message,
      });
    } else {
      console.log("Ranking assigned: ", res.data);
      await refetchApplications();
    }
  };

  const handleUpdateStatus = async () => {
    console.log("updating status");

    const res = await updateApplicationStatus({
      _id: targetApplication?._id,
      statusInt: applicationStatusInt,
    });

    if (res.error) {
      console.log("Error updating status: ", res.error);
      handleError.showError({
        title: "Error updating status",
        message: res.error.data.message,
      });
    } else {
      console.log("Status updated: ", res.data);
      await refetchApplications();
    }
  };

  console.log("!!!!!targetListing: ", targetListing);

  return (
    <div>
      {(user === targetListing?.postedBy || roles.includes(5173)) && (
        <div className="text-uos-gray gap-y-4">
          <p className="font-light">
            Manage the members and overall status of the ranking panel here. The
            panel staff will be able to assign a ranking for all applications to
            this listing, but won't be able to see the rankings of other panel
            members.
          </p>
          <div className="grid items-start grid-cols-5 mt-4 gap-x-8">
            {!isLoadingPanelMembers && dataPanelMembers && (
              <div className="col-span-3">
                <p className="">
                  {dataPanelMembers.length > 0
                    ? "Panel Members:"
                    : "No Panel Members"}
                </p>
                {dataPanelMembers.map((member) => (
                  <div className="">
                    <div
                      className="flex flex-row items-center justify-between w-full"
                      key={member}
                    >
                      <p className="flex flex-col items-end italic text-right">
                        {member}
                      </p>
                      <p
                        className={
                          (!targetListing?.ranking
                            ?.find(
                              (ranking) =>
                                ranking.applicationId === targetApplication?._id
                            )
                            ?.staffRanks?.find(
                              (rank) => rank.staffMemberUsername === member
                            )?.ranking
                            ? "text-uos-gray"
                            : "") +
                          (targetListing?.ranking
                            ?.find(
                              (ranking) =>
                                ranking.applicationId === targetApplication?._id
                            )
                            ?.staffRanks?.find(
                              (rank) => rank.staffMemberUsername === member
                            )?.ranking === 0
                            ? "text-red-500"
                            : "") +
                          (targetListing?.ranking
                            ?.find(
                              (ranking) =>
                                ranking.applicationId === targetApplication?._id
                            )
                            ?.staffRanks?.find(
                              (rank) => rank.staffMemberUsername === member
                            )?.ranking === 1
                            ? "text-yellow-500"
                            : "") +
                          (targetListing?.ranking
                            ?.find(
                              (ranking) =>
                                ranking.applicationId === targetApplication?._id
                            )
                            ?.staffRanks?.find(
                              (rank) => rank.staffMemberUsername === member
                            )?.ranking === 2
                            ? "text-green-500"
                            : "")
                        }
                      >
                        {(!targetListing?.ranking
                          ?.find(
                            (ranking) =>
                              ranking.applicationId === targetApplication?._id
                          )
                          ?.staffRanks?.find(
                            (rank) => rank.staffMemberUsername === member
                          )?.ranking
                          ? "Not Ranked"
                          : "") +
                          (targetListing?.ranking
                            ?.find(
                              (ranking) =>
                                ranking.applicationId === targetApplication?._id
                            )
                            ?.staffRanks?.find(
                              (rank) => rank.staffMemberUsername === member
                            )?.ranking === 0
                            ? "No"
                            : "") +
                          (targetListing?.ranking
                            ?.find(
                              (ranking) =>
                                ranking.applicationId === targetApplication?._id
                            )
                            ?.staffRanks?.find(
                              (rank) => rank.staffMemberUsername === member
                            )?.ranking === 1
                            ? "Maybe"
                            : "") +
                          (targetListing?.ranking
                            ?.find(
                              (ranking) =>
                                ranking.applicationId === targetApplication?._id
                            )
                            ?.staffRanks?.find(
                              (rank) => rank.staffMemberUsername === member
                            )?.ranking === 2
                            ? "Yes"
                            : "")}
                      </p>
                    </div>
                    {targetListing?.ranking
                      ?.find(
                        (ranking) =>
                          ranking.applicationId === targetApplication?._id
                      )
                      ?.staffRanks?.find(
                        (rank) => rank.staffMemberUsername === member
                      )?.comments && (
                      <p className="mx-4 italic text-left text-uos-lightgray">
                        "
                        {
                          targetListing?.ranking
                            ?.find(
                              (ranking) =>
                                ranking.applicationId === targetApplication?._id
                            )
                            ?.staffRanks?.find(
                              (rank) => rank.staffMemberUsername === member
                            )?.comments
                        }
                        "
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="col-span-2">
              <TextInputBox
                labelText="Add Panel Member"
                value={panelMemberUsername}
                onChange={(value) => setPanelMemberUsername(value)}
                placeholder="Username"
              />
              <button
                onClick={() => {
                  handleAssignStaffToPanel();
                }}
                className="w-full p-2 mt-4 text-white transition rounded-lg bg-uos-purple hover:bg-uos-purple-hover focus:outline-none disabled:bg-gray-300"
                disabled={isLoadingAssignStaffToPanel}
              >
                Add Panel Member
              </button>
              <hr className="my-4" />
              <SelectInputBox
                labelText="Application Status"
                value={applicationStatusInt.toString()}
                onChange={(value) => {
                  // console.log(parseInt(value));
                  setApplicationStatusInt(parseInt(value));
                }}
                options={
                  // iterate through 0-10 and get the corresponding string
                  // for each status
                  Array.from({ length: 11 }, (_, i) => ({
                    value: i.toString(),
                    label: statusIntStrings[i],
                  }))
                }
                required
                placeholder="Application Status"
              />
              <button
                onClick={() => {
                  handleUpdateStatus();
                }}
                className="w-full p-2 mt-4 text-white transition rounded-lg bg-uos-purple hover:bg-uos-purple-hover focus:outline-none disabled:bg-gray-300"
                disabled={isLoadingUpdateApplicationStatus}
              >
                Update Status
              </button>
            </div>
          </div>
          <hr className="my-4" />
        </div>
      )}
      {targetListing?.panelMembers.includes(user) ? (
        <div className="grid w-full grid-cols-4 gap-4">
          <h2 className="col-span-4 text-lg font-semibold text-uos-gray">
            Assign Ranking
          </h2>
          <p className="col-span-4 font-light text-uos-gray">
            You are a member of the ranking panel for this listing. You can
            assign a ranking to the applications here.
          </p>
          <SelectInputBox
            labelText="Ranking"
            value={userRankingNumber}
            onChange={(value) => setUserRankingNumber(value)}
            options={[
              { value: "0", label: "No" },
              { value: "1", label: "Maybe" },
              { value: "2", label: "Yes" },
            ]}
            required
            placeholder="Ranking"
          />
          <TextInputBox
            labelText="Comments"
            value={userRanking.comments}
            onChange={(value) =>
              setUserRanking({ ...userRanking, comments: value })
            }
            placeholder="Comments"
            className="col-span-2"
          />
          <button
            className="col-span-1 p-[9px] mt-auto text-white transition rounded-lg h-min bg-uos-purple hover:bg-uos-purple-hover focus:outline-none disabled:bg-gray-300 "
            onClick={() => {
              console.log("assigning ranking");
              assignRanking();
              // refetchPanelMembers();
            }}
            disabled={isLoadingSetRanking}
          >
            Assign Ranking
          </button>
        </div>
      ) : (
        <p className="font-light text-uos-gray">
          You are not a member of the ranking panel for this listing. You cannot
          view or assign rankings.
        </p>
      )}
    </div>
  );
};

/**
 * ViewApplicantsModal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const ViewApplicantsModal = ({
  className,
  targetListing,
}: ViewApplicantsModalProps) => {
  const {
    data: dataApplications,
    isLoading: isLoadingApplications,
    refetch: refetchApplications,
  } = useGetStaffApplicationsFromListingQuery({
    _id: targetListing._id,
  });

  const [applications, setApplications] = useState<ApplicationType[] | null>(
    dataApplications
  );

  useEffect(() => {
    setApplications(dataApplications);
  }, [dataApplications]);

  const [tempApplicationStatus, setTempApplicationStatus] = useState(0);

  const [sortingOptions, setSortingOptions] = useState({
    sort: "createdAt",
    order: "desc",
  });

  const [openApplicationId, setOpenApplicationId] = useState("");

  console.log("dataApplications: ", dataApplications);

  return (
    <div className={`${className}`}>
      {isLoadingApplications ? (
        <LoadingSpinner />
      ) : (
        <div className="">
          <AnimatePresence mode="wait">
            {applications &&
              applications.length > 0 &&
              applications?.map((application) => (
                <motion.div
                  key={application._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (openApplicationId === application._id) {
                      // setOpenApplicationId("");
                    } else {
                      setOpenApplicationId(application._id);
                    }
                  }}
                  className={`p-4 my-2 transition bg-white shadow  rounded-2xl ${openApplicationId === application._id ? "" : "hover:bg-gray-50 cursor-pointer"}`}
                >
                  <div className="flex flex-row items-center justify-between w-full ">
                    <div className="flex flex-col items-start">
                      <p className="">
                        {application.profile.names.first +
                          " " +
                          application.profile.names.last}
                      </p>
                      <p className="font-light text-uos-gray">
                        Application ID:{" "}
                        <span className="italic">{application._id}</span>
                      </p>
                    </div>
                    <div className="flex flex-row items-center gap-x-4">
                      <p
                        className={`px-4 py-1 border rounded-lg ${
                          application.statusInt === 0
                            ? "bg-gray-100 text-gray-800"
                            : application.statusInt > 0 &&
                                application.statusInt < 4
                              ? "bg-yellow-100 text-yellow-800"
                              : application.statusInt === 4
                                ? "bg-blue-100 text-blue-800"
                                : application.statusInt > 4 &&
                                    application.statusInt < 6
                                  ? "bg-green-100 text-green-800"
                                  : application.statusInt >= 6 &&
                                      application.statusInt < 10
                                    ? "bg-red-100 text-red-800"
                                    : "bg-orange-100 text-orange-800"
                        }`}
                        // onClick={() => {
                        //   if (tempApplicationStatus === 10) {
                        //     setTempApplicationStatus(0);
                        //   } else {
                        //     setTempApplicationStatus(tempApplicationStatus + 1);
                        //   }
                        // }}
                      >
                        {statusIntStrings[application.statusInt]}
                      </p>
                      <button
                        onClick={() => {
                          if (openApplicationId === application._id) {
                            setOpenApplicationId("");
                          } else {
                            setOpenApplicationId(application._id);
                          }
                        }}
                        className="p-2 transition rounded-full focus:outline-none hover:bg-gray-50"
                      >
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-chevron-down"
                          viewBox="0 0 16 16"
                          animate={{
                            scaleY:
                              openApplicationId === application._id ? -1 : 1,
                          }}
                          transition={{
                            type: "tween",
                            ease: "easeInOut",
                            duration: 0.2,
                          }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                          />
                        </motion.svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <p className="font-light text-uos-gray">
                      Application Submitted:{" "}
                      <span className="italic">
                        {new Date(application.createdAt).toLocaleDateString() +
                          " at " +
                          new Date(application.createdAt).toLocaleTimeString()}
                      </span>
                    </p>
                    <p className="font-light text-uos-gray">
                      Last Updated:{" "}
                      <span className="italic">
                        {new Date(application.createdAt).toLocaleDateString() +
                          " at " +
                          new Date(application.createdAt).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                  <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{
                      height:
                        openApplicationId === application._id ? "auto" : 0,
                    }}
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.2,
                    }}
                  >
                    <div>
                      {/* <div className="flex flex-row items-end justify-between w-full gap-x-8">
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
                      </div> */}

                      <div className="grid w-full grid-cols-4 gap-4">
                        <div className="col-span-4">
                          <hr className="my-4" />
                          <h2 className="text-lg font-semibold text-uos-gray">
                            Actions
                          </h2>
                        </div>
                        <div className="col-span-4">
                          <RankingPanel
                            className=""
                            targetListing={targetListing}
                            targetApplication={application}
                            refetchApplications={refetchApplications}
                          />
                        </div>
                        {/* <div className="flex flex-row flex-wrap items-start justify-start col-span-4 gap-x-4 gap-y-2">
                          {application.flags && (
                            <DataPoint
                              title="Flags"
                              content={
                                application.flags === "Action Required"
                                  ? "Action Required (check email)"
                                  : application.flags
                              }
                              className={
                                application.flags === "Action Required"
                                  ? "border-red-600"
                                  : ""
                              }
                            />
                          )}
                          <DataPoint
                            title="Status"
                            content={
                              (application.statusInt < 5 && "Pending") ||
                              (application.statusInt < 10 && "Accepted") ||
                              (application.statusInt < 15 && "Rejected") ||
                              "Unknown"
                            }
                            className="col-span-1"
                          />
                          {application.statusInfo && (
                            <DataPoint
                              title="Status Info"
                              content={application.statusInfo}
                              className="col-span-3"
                            />
                          )}
                          <DataPoint
                            title="Last Update"
                            content={
                              new Date(
                                application.updatedAt
                              ).toLocaleDateString() +
                              " at " +
                              new Date(
                                application.updatedAt
                              ).toLocaleTimeString()
                            }
                            className="col-span-2"
                          />
                        </div> */}

                        <div className="col-span-4">
                          <hr className="my-4" />
                          <h2 className="text-lg font-semibold text-uos-gray">
                            Application Details
                          </h2>
                        </div>
                        <div className="flex flex-col col-span-2 gap-y-4">
                          <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                            <p className="mb-2 text-lg font-semibold text-uos-gray">
                              Personal Details
                            </p>
                            <DataRow
                              title="First Name"
                              content={application.profile.names.first}
                              className=""
                            />
                            <DataRow
                              title="Last Name"
                              content={application.profile.names.last}
                              className=""
                            />
                            {application.profile.names.other && (
                              <DataRow
                                title="Other Names"
                                content={application.profile.names.other}
                                className=""
                              />
                            )}
                            {application.profile.contactDetails.email && (
                              <DataRow
                                title="Email"
                                content={
                                  application.profile.contactDetails.email
                                }
                                className=""
                              />
                            )}
                            {application.profile.contactDetails.phone && (
                              <DataRow
                                title="Phone"
                                content={
                                  application.profile.contactDetails.phone
                                }
                                className=""
                              />
                            )}
                            <hr className="my-2" />
                            <DataRow
                              title="House"
                              content={application.profile.address.house}
                              className=""
                            />
                            <DataRow
                              title="Street"
                              content={application.profile.address.street}
                              className=""
                            />
                            <DataRow
                              title="City"
                              content={application.profile.address.city}
                              className=""
                            />
                            <DataRow
                              title="Country"
                              content={application.profile.address.country}
                              className=""
                            />
                            <DataRow
                              title="Postcode"
                              content={application.profile.address.postcode}
                              className=""
                            />
                          </div>
                          {application.profile.education &&
                            application.profile.education.length > 0 && (
                              <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                                <p className="mb-2 text-lg font-semibold text-uos-gray">
                                  Education
                                </p>
                                {application.profile.education.map(
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
                                        application.profile.education.length -
                                          1 && <hr className="my-2" />}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          {application.profile.workExperience &&
                            application.profile.workExperience.length > 0 && (
                              <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                                <p className="mb-2 text-lg font-semibold text-uos-gray">
                                  Work Experience
                                </p>
                                {application.profile.workExperience.map(
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
                                            "£" +
                                            experience.salary.toLocaleString()
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
                                        application.profile.workExperience
                                          .length -
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
                                application.profile.questionnaireAnswers
                                  .c_criminalConvictions.q_unspentConvictions
                                  ? "Yes"
                                  : "No"
                              }
                              className=""
                            />
                            <DataRow
                              title="Spent Convictions"
                              content={
                                application.profile.questionnaireAnswers
                                  .c_criminalConvictions.q_spentConvictions
                                  ? "Yes"
                                  : "No"
                              }
                              className=""
                            />
                            <DataRow
                              title="Details"
                              content={
                                application.profile.questionnaireAnswers
                                  .c_criminalConvictions
                                  .q_additionalInformation || "Not Provided"
                              }
                              className=""
                            />
                            <hr className="my-2" />
                            <DataRow
                              title="Disability Consideration"
                              content={
                                application.profile.questionnaireAnswers
                                  .c_disability.q_disability
                                  ? "Yes"
                                  : "No"
                              }
                              className=""
                            />
                            <DataRow
                              title="Details"
                              content={
                                application.profile.questionnaireAnswers
                                  .c_disability.q_additionalInformation ||
                                "Not Provided"
                              }
                              className=""
                            />
                            <hr className="my-2" />
                            <DataRow
                              title="Eligibility to Work"
                              content={
                                application.profile.questionnaireAnswers
                                  .c_eligibilityToWork.q_eligibilityToWork
                                  ? "Yes"
                                  : "No"
                              }
                              className=""
                            />
                            <DataRow
                              title="Details"
                              content={
                                application.profile.questionnaireAnswers
                                  .c_eligibilityToWork
                                  .q_additionalInformation || "Not Provided"
                              }
                              className=""
                            />
                            <DataRow
                              title="Visa Expires"
                              content={
                                application.profile.questionnaireAnswers
                                  .c_eligibilityToWork.q_visaInformation
                                  ? new Date(
                                      application.profile.questionnaireAnswers.c_eligibilityToWork.q_visaInformation
                                    ).toLocaleDateString()
                                  : "Not Provided"
                              }
                              className=""
                            />
                          </div>
                          {application.profile.questionnaireAnswers
                            .c_references &&
                            application.profile.questionnaireAnswers
                              .c_references.length > 0 && (
                              <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                                <p className="mb-2 text-lg font-semibold text-uos-gray">
                                  References
                                </p>
                                {application.profile.questionnaireAnswers.c_references.map(
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
                                              content={
                                                reference.contactDetails.email
                                              }
                                              className=""
                                            />
                                          )}
                                          {reference.contactDetails.phone && (
                                            <DataRow
                                              title="Phone"
                                              content={
                                                reference.contactDetails.phone
                                              }
                                              className=""
                                            />
                                          )}
                                        </div>
                                      )}
                                      <DataRow
                                        title="Can Contact"
                                        content={
                                          reference.canContact ? "Yes" : "No"
                                        }
                                        className=""
                                      />
                                      {index <
                                        application.profile.questionnaireAnswers
                                          .c_references.length -
                                          1 && <hr className="my-2" />}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          {application.profile.savedResources &&
                            application.profile.savedResources.length > 0 && (
                              <div className="col-span-2 p-2 border rounded-lg bg-gray-50">
                                <p className="mb-2 text-lg font-semibold text-uos-gray">
                                  Attachments
                                </p>
                                {application.profile.savedResources.map(
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
                                            resourceTypeStrings[
                                              resource.resourceType
                                            ]
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
                                        application.profile.savedResources
                                          .length -
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
                        {application.textContent && (
                          <MarkdownEditor.Markdown
                            source={application.textContent || ""}
                            className={`col-span-4 ${tailwindCustomProseClass}`}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ViewApplicantsModal;
