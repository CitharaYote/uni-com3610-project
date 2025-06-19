/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import ListingTypePublic from "../../types/ListingTypePublic";
import SelectInputBox from "../misc/SelectInputBox";
import TextInputBox from "../misc/TextInputBox";
import DatePicker from "../misc/DatePicker";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ProfileType from "../../types/ProfileType";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/profile/profileApiSlice";
import { useNavigate } from "react-router-dom";
import { useNewApplicationMutation } from "../../redux/application/applicationApiSlice";
import { useError } from "../common/ErrorDisplay";

// Package Imports

// Component Imports

// Asset Imports

export type ApplicationModalProps = {
  className?: string;
  targetListing: ListingTypePublic;
};

/**
 * ApplicationModal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const ApplicationModal = ({
  className,
  targetListing,
}: ApplicationModalProps) => {
  // whether to use a blank template or import from the user's profile
  //   const [blankApplication, setBlankApplication] = useState<boolean | null>(
  //     null
  //   );
  const [applicationStage, setApplicationStage] = useState(0);

  const navigate = useNavigate();

  const blankProfile: ProfileType = {
    names: {
      first: "",
      last: "",
      other: "",
    },
    contactDetails: {
      email: "",
      phone: "",
    },
    address: {
      house: "",
      street: "",
      city: "",
      country: "",
      postcode: "",
    },
    savedResources: [],
    education: [],
    workExperience: [],
    questionnaireAnswers: {
      c_criminalConvictions: {
        q_unspentConvictions: null,
        q_spentConvictions: null,
        q_additionalInformation: "",
      },
      c_disability: {
        q_disability: null,
        q_additionalInformation: "",
      },
      c_eligibilityToWork: {
        q_eligibilityToWork: null,
        q_additionalInformation: "",
        q_visaInformation: null,
      },
      c_references: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    isSuccess: profileSuccess,
    refetch: refetchProfile,
  } = useGetProfileQuery({});

  const [profileTemplate, setProfileTemplate] =
    useState<ProfileType>(blankProfile);

  const [
    updateProfile,
    { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate },
  ] = useUpdateProfileMutation();

  const [validating, setValidating] = useState(false);
  const [textContent, setTextContent] = useState(""); // needed as it's seperate from the profileTemplate

  const importData = () => {
    // import any available data from the user's profile
    if (
      profileSuccess &&
      !(
        Object.keys(profileData).length === 0 ||
        (Object.keys(profileData).length < 7 &&
          profileData.education.length === 0 &&
          profileData.workExperience.length === 0 &&
          profileData.savedResources.length === 0)
      )
    ) {
      console.log("setting profile template");

      setProfileTemplate(profileData);
      setApplicationStage(1);
      return;
    }

    // if no data is available, reset the form
    console.log("resetting form");
    setApplicationStage(1);
    setProfileTemplate(blankProfile);
  };

  const handleSubmit1 = async () => {
    // check if required fields are filled in
    if (
      !profileTemplate.names.first ||
      !profileTemplate.names.last ||
      !profileTemplate.contactDetails.email ||
      !profileTemplate.contactDetails.phone ||
      !profileTemplate.address.house ||
      !profileTemplate.address.street ||
      !profileTemplate.address.city ||
      !profileTemplate.address.country ||
      !profileTemplate.address.postcode ||
      !profileTemplate.education ||
      !profileTemplate.workExperience ||
      profileTemplate.questionnaireAnswers.c_criminalConvictions
        .q_unspentConvictions === null ||
      profileTemplate.questionnaireAnswers.c_criminalConvictions
        .q_spentConvictions === null ||
      profileTemplate.questionnaireAnswers.c_disability.q_disability === null ||
      profileTemplate.questionnaireAnswers.c_eligibilityToWork
        .q_eligibilityToWork === null
    ) {
      setValidating(true);
      console.log("missing fields");

      handleError.showError({
        title: "Required Fields Missing",
        message: "Please fill in all required fields",
      });
      return;
    } else {
      setValidating(false);
    }

    // create the listing
    console.log("sending listing");
    console.log(profileTemplate);

    setApplicationStage(2);

    // const result = await updateProfile({ profile: profileTemplate });
    // console.log(result);

    // if (result.error) {
    //   console.error(result.error);
    // } else {
    //   closeModal();
    // }

    // reset the form
  };

  const [
    newApplication,
    {
      isLoading: isLoadingNewApplication,
      isSuccess: isSuccessNewAppliation,
      isError: isErrorNewApplication,
    },
  ] = useNewApplicationMutation();

  const handleError = useError();

  const handleSubmit2 = async () => {
    // check if required fields are filled in

    // if there's less than 2 references
    if (profileTemplate.questionnaireAnswers.c_references.length < 2) {
      setValidating(true);
      return;
    } else {
      setValidating(false);
      // do api stuff to submit the application
      // if successful, go to stage 3
      //   setApplicationStage(3);

      const result = await newApplication({
        applicantId: profileTemplate._id,
        jobPostingId: targetListing._id,
        profile: profileTemplate,
        textContent,
        statusInt: 0, // 0 = submitted, 1 = shortlisted, 2 = rejected etc.
        // createdAt: new Date(),
        // updatedAt: new Date(),
        // deleteBy: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180), // delete in 180 days TODO: adjust?
      });
      console.log(result);

      if (result.error) {
        handleError.showError({
          title: "An Error Occurred",
          message: result.error.data.message,
        });
      } else {
        setApplicationStage(3);
      }
    }

    // reset the form
  };

  return (
    <div className={`${className} w-full pb-8 px-6`}>
      <AnimatePresence mode="wait">
        {applicationStage === 0 && (
          <motion.div
            className="w-full"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            key="blankApplication"
          >
            <div className="flex flex-col items-center w-full mb-12">
              <h1 className="text-2xl font-normal text-uos-gray">
                Start a new application
              </h1>
              <p className="text-sm italic font-light text-uos-gray">
                You can create a new application from scratch, or import your
                details from your profile.
              </p>
              <p className="mb-4 text-sm italic font-light text-uos-gray">
                You'll still be able to review and edit your application before
                finalising.
              </p>
            </div>
            <div className="flex flex-row items-center w-full gap-x-8">
              <button
                className="flex flex-col items-center w-full py-8 font-light transition-colors bg-white border gap-y-4 hover:bg-gray-50 rounded-xl text-uos-gray "
                onClick={() => setApplicationStage(1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-file-earmark-plus text-uos-lightgray"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5" />
                  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
                </svg>
                <p>Start a fresh application</p>
              </button>
              <button
                className="flex flex-col items-center w-full py-8 font-light transition bg-white border gap-y-4 hover:bg-gray-50 rounded-xl text-uos-gray "
                onClick={() => importData()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-file-earmark-plus text-uos-lightgray"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                </svg>
                <p>Import from your profile</p>
              </button>
            </div>
          </motion.div>
        )}
        {applicationStage === 1 && (
          <motion.div
            className="w-full"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            key="applicationForm"
          >
            <p className="mb-4 text-sm italic text-uos-gray">
              All fields marked with * are required. Information you enter here
              will be used to autofill applications, but you'll always have the
              chance to review and edit before submitting.
            </p>
            <p className="mb-4 text-sm italic text-uos-gray">
              All information will be stored securely and can not be accessed by
              any staff outside of those involved in the recruitment process for
              jobs you've submitted applications to, or any third parties.
            </p>
            <AnimatePresence>
              <div className="grid w-full grid-cols-4 gap-4">
                <div className="col-span-4">
                  <hr className="my-4" />
                  <h2 className="text-lg font-semibold text-uos-gray">
                    Personal Information
                  </h2>
                </div>
                <TextInputBox
                  className="col-span-1"
                  value={profileTemplate.names.first}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      names: {
                        ...profileTemplate.names,
                        first: value,
                      },
                    });
                  }}
                  placeholder="First Name"
                  labelText="First Name"
                  required
                  validating={validating}
                />
                <TextInputBox
                  className="col-span-1"
                  value={profileTemplate.names.last}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      names: {
                        ...profileTemplate.names,
                        last: value,
                      },
                    });
                  }}
                  placeholder="Last Name"
                  labelText="Last Name"
                  required
                  validating={validating}
                />
                <TextInputBox
                  className="col-span-2"
                  value={profileTemplate.names.other || ""}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      names: {
                        ...profileTemplate.names,
                        other: value,
                      },
                    });
                  }}
                  placeholder="Other Names"
                  labelText="Other Names"
                />
                <TextInputBox
                  className="col-span-2"
                  value={profileTemplate.contactDetails.email}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      contactDetails: {
                        ...profileTemplate.contactDetails,
                        email: value,
                      },
                    });
                  }}
                  placeholder="Email"
                  labelText="Email"
                  required
                  validating={validating}
                />
                <TextInputBox
                  className="col-span-2"
                  value={profileTemplate.contactDetails.phone}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      contactDetails: {
                        ...profileTemplate.contactDetails,
                        phone: value,
                      },
                    });
                  }}
                  placeholder="Phone Number"
                  labelText="Phone Number"
                  required
                  validating={validating}
                />
                <div className="col-span-4">
                  <hr className="my-4" />
                  <h2 className="text-lg font-semibold text-uos-gray">
                    Address
                  </h2>
                </div>
                <TextInputBox
                  className="col-span-2"
                  value={profileTemplate.address.house}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      address: {
                        ...profileTemplate.address,
                        house: value,
                      },
                    });
                  }}
                  placeholder="House Number/Name"
                  labelText="House Number/Name"
                  required
                  validating={validating}
                />
                <TextInputBox
                  className="col-span-2"
                  value={profileTemplate.address.street}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      address: {
                        ...profileTemplate.address,
                        street: value,
                      },
                    });
                  }}
                  placeholder="Street"
                  labelText="Street"
                  required
                  validating={validating}
                />
                <TextInputBox
                  className="col-span-1"
                  value={profileTemplate.address.city}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      address: {
                        ...profileTemplate.address,
                        city: value,
                      },
                    });
                  }}
                  placeholder="City"
                  labelText="City"
                  required
                  validating={validating}
                />
                <TextInputBox
                  className="col-span-1"
                  value={profileTemplate.address.country}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      address: {
                        ...profileTemplate.address,
                        country: value,
                      },
                    });
                  }}
                  placeholder="Country"
                  labelText="Country"
                  required
                  validating={validating}
                />
                <TextInputBox
                  className="col-span-1"
                  value={profileTemplate.address.postcode}
                  onChange={(value) => {
                    setProfileTemplate({
                      ...profileTemplate,
                      address: {
                        ...profileTemplate.address,
                        postcode: value,
                      },
                    });
                  }}
                  placeholder="Postcode"
                  labelText="Postcode"
                  required
                  validating={validating}
                />
                <div className="col-span-4">
                  <hr className="my-4" />
                  <h2 className="text-lg font-semibold text-uos-gray">
                    Education
                  </h2>
                </div>

                {profileTemplate.education.map((education, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 col-span-2 gap-4 p-2 bg-gray-100 border rounded-lg"
                  >
                    <TextInputBox
                      className="col-span-1"
                      value={education.institution || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          education: [
                            ...profileTemplate.education.slice(0, index),
                            { ...education, institution: value },
                            ...profileTemplate.education.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Institution"
                      labelText="Institution"
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={education.qualification || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          education: [
                            ...profileTemplate.education.slice(0, index),
                            { ...education, qualification: value },
                            ...profileTemplate.education.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Qualification"
                      labelText="Qualification"
                    />
                    <DatePicker
                      value={
                        education.period.start
                          ? new Date(education.period.start).toISOString()
                          : ""
                      }
                      onChange={(value: Date) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          education: [
                            ...profileTemplate.education.slice(0, index),
                            {
                              ...education,
                              period: { ...education.period, start: value },
                            },
                            ...profileTemplate.education.slice(index + 1),
                          ],
                        });
                      }}
                      labelText="Start Date"
                      required
                    />
                    <DatePicker
                      value={
                        education.period.end
                          ? new Date(education.period.end).toISOString()
                          : ""
                      }
                      onChange={(value: Date) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          education: [
                            ...profileTemplate.education.slice(0, index),
                            {
                              ...education,
                              period: { ...education.period, end: value },
                            },
                            ...profileTemplate.education.slice(index + 1),
                          ],
                        });
                      }}
                      labelText="End Date"
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={education.subject || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          education: [
                            ...profileTemplate.education.slice(0, index),
                            { ...education, subject: value },
                            ...profileTemplate.education.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Subject"
                      labelText="Subject"
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={education.grade || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          education: [
                            ...profileTemplate.education.slice(0, index),
                            { ...education, grade: value },
                            ...profileTemplate.education.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Grade(s)"
                      labelText="Grade(s)"
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={education.country || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          education: [
                            ...profileTemplate.education.slice(0, index),
                            { ...education, country: value },
                            ...profileTemplate.education.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Country"
                      labelText="Country"
                    />
                    <button
                      className="col-span-2 px-4 py-2 mt-auto text-white transition-colors bg-red-700 rounded-lg h-min hover:bg-red-600"
                      onClick={() => {
                        const newEducation = [...profileTemplate.education];
                        newEducation.splice(index, 1);
                        setProfileTemplate({
                          ...profileTemplate,
                          education: newEducation,
                        });
                      }}
                    >
                      <p className="">Remove</p>
                    </button>
                  </div>
                ))}
                <div className="col-span-1">
                  <button
                    className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
                    onClick={() => {
                      setProfileTemplate({
                        ...profileTemplate,
                        education: [
                          ...profileTemplate.education,
                          {
                            institution: "",
                            period: {
                              start: null,
                              end: null,
                            },
                            qualification: "",
                            subject: "",
                            grade: "",
                            country: "",
                          },
                        ],
                      });
                    }}
                  >
                    Add Education
                  </button>
                </div>
                <div className="col-span-4">
                  <hr className="my-4" />
                  <h2 className="text-lg font-semibold text-uos-gray">
                    Experience
                  </h2>
                </div>
                {profileTemplate.workExperience?.map((experience, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 col-span-2 gap-4 p-2 bg-gray-100 border rounded-lg"
                  >
                    <TextInputBox
                      className="col-span-1"
                      value={experience.company || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: [
                            ...profileTemplate.workExperience.slice(0, index),
                            { ...experience, company: value },
                            ...profileTemplate.workExperience.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Company"
                      labelText="Company"
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={experience.jobTitle || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: [
                            ...profileTemplate.workExperience.slice(0, index),
                            { ...experience, jobTitle: value },
                            ...profileTemplate.workExperience.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Job Title"
                      labelText="Job Title"
                    />
                    <DatePicker
                      value={
                        experience.period.start
                          ? new Date(experience.period.start).toISOString()
                          : ""
                      }
                      onChange={(value: Date) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: [
                            ...profileTemplate.workExperience.slice(0, index),
                            {
                              ...experience,
                              period: { ...experience.period, start: value },
                            },
                            ...profileTemplate.workExperience.slice(index + 1),
                          ],
                        });
                      }}
                      labelText="Start Date"
                      required
                    />
                    <DatePicker
                      value={
                        experience.period.end
                          ? new Date(experience.period.end).toISOString()
                          : ""
                      }
                      onChange={(value: Date) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: [
                            ...profileTemplate.workExperience.slice(0, index),
                            {
                              ...experience,
                              period: { ...experience.period, end: value },
                            },
                            ...profileTemplate.workExperience.slice(index + 1),
                          ],
                        });
                      }}
                      labelText="End Date"
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={experience.country || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: [
                            ...profileTemplate.workExperience.slice(0, index),
                            { ...experience, country: value },
                            ...profileTemplate.workExperience.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Country"
                      labelText="Country"
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={experience.noticePeriod || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: [
                            ...profileTemplate.workExperience.slice(0, index),
                            { ...experience, noticePeriod: value },
                            ...profileTemplate.workExperience.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Notice Period"
                      labelText="Notice Period"
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={experience.salary || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: [
                            ...profileTemplate.workExperience.slice(0, index),
                            { ...experience, salary: value },
                            ...profileTemplate.workExperience.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Salary"
                      labelText="Salary"
                      type="number"
                    />
                    {/* reason for leaving select bot */}
                    <SelectInputBox
                      className="col-span-1"
                      value={experience.reasonForLeaving || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: [
                            ...profileTemplate.workExperience.slice(0, index),
                            { ...experience, reasonForLeaving: value },
                            ...profileTemplate.workExperience.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Select Reason"
                      labelText="Reason For Leaving"
                      options={[
                        { value: "contractEnd", label: "Contract End" },
                        { value: "redundancy", label: "Redundancy" },
                        { value: "jobChange", label: "Job Change" },
                        {
                          value: "careerProgression",
                          label: "Career Progression",
                        },
                        { value: "relocation", label: "Relocation" },
                        { value: "other", label: "Other" },
                      ]}
                      required
                    />
                    <TextInputBox
                      className="col-span-2"
                      value={experience.description || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: [
                            ...profileTemplate.workExperience.slice(0, index),
                            { ...experience, description: value },
                            ...profileTemplate.workExperience.slice(index + 1),
                          ],
                        });
                      }}
                      placeholder="Role Description"
                      labelText="Role Description"
                      supportsMarkdown
                      lineHeight={4}
                    />
                    <button
                      className="col-span-2 px-4 py-2 mt-auto text-white transition-colors bg-red-700 rounded-lg h-min hover:bg-red-600"
                      onClick={() => {
                        const newExperience = [
                          ...profileTemplate.workExperience,
                        ];
                        newExperience.splice(index, 1);
                        setProfileTemplate({
                          ...profileTemplate,
                          workExperience: newExperience,
                        });
                      }}
                    >
                      <p className="">Remove</p>
                    </button>
                  </div>
                ))}
                <div className="col-span-1">
                  <button
                    className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
                    onClick={() => {
                      setProfileTemplate({
                        ...profileTemplate,
                        workExperience: [
                          ...profileTemplate.workExperience,
                          {
                            company: "",
                            period: {
                              start: null,
                              end: null,
                            },
                            country: "",
                            noticePeriod: "",
                            jobTitle: "",
                            description: "",
                            salary: null,
                            reasonForLeaving: "",
                          },
                        ],
                      });
                    }}
                  >
                    Add Experience
                  </button>
                </div>

                {/*  */}

                <div className="col-span-4">
                  <hr className="my-4" />
                  <h2 className="text-lg font-semibold text-uos-gray">
                    Application Questionnaire
                  </h2>
                </div>

                <div className="grid grid-cols-4 col-span-4 gap-4 p-4 bg-gray-100 border rounded-lg">
                  {/* yes/no for questionnaireAnswers.c_criminalConvictions.q_unspentConvictions */}
                  {/* value should be boolean but needs to be string for select box */}
                  <SelectInputBox
                    className="col-span-4"
                    value={
                      profileTemplate.questionnaireAnswers.c_criminalConvictions
                        .q_unspentConvictions === null
                        ? ""
                        : profileTemplate.questionnaireAnswers
                              .c_criminalConvictions.q_unspentConvictions
                          ? "yes"
                          : "no"
                    }
                    onChange={(value) => {
                      console.log(value);

                      setProfileTemplate({
                        ...profileTemplate,
                        questionnaireAnswers: {
                          ...profileTemplate.questionnaireAnswers,
                          c_criminalConvictions: {
                            ...profileTemplate.questionnaireAnswers
                              .c_criminalConvictions,
                            q_unspentConvictions:
                              value === null ? null : value === "yes",
                          },
                        },
                      });
                    }}
                    placeholder="Select Answer"
                    labelText="Do you have any unspent conditional cautions or convictions under the Rehabilitation of Offenders Act 1974?"
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                    required
                    validating={validating}
                  />
                  {/* spent convictions */}
                  <SelectInputBox
                    className="col-span-4"
                    value={
                      profileTemplate.questionnaireAnswers.c_criminalConvictions
                        .q_spentConvictions === null
                        ? ""
                        : profileTemplate.questionnaireAnswers
                              .c_criminalConvictions.q_spentConvictions
                          ? "yes"
                          : "no"
                    }
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        questionnaireAnswers: {
                          ...profileTemplate.questionnaireAnswers,
                          c_criminalConvictions: {
                            ...profileTemplate.questionnaireAnswers
                              .c_criminalConvictions,
                            q_spentConvictions:
                              value === null ? null : value === "yes",
                          },
                        },
                      });
                    }}
                    placeholder="Select Answer"
                    labelText="Do you have any adult cautions (simple or conditional) or spent convictions that are not protected as defined by the Rehabilitation of Offenders Act 1974 (Exceptions) Order 1975 (Amendment) (England and Wales) Order 2020?"
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                    required
                    validating={validating}
                  />
                  <TextInputBox
                    className="col-span-4"
                    value={
                      profileTemplate.questionnaireAnswers.c_criminalConvictions
                        .q_additionalInformation || ""
                    }
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        questionnaireAnswers: {
                          ...profileTemplate.questionnaireAnswers,
                          c_criminalConvictions: {
                            ...profileTemplate.questionnaireAnswers
                              .c_criminalConvictions,
                            q_additionalInformation: value,
                          },
                        },
                      });
                    }}
                    placeholder="Additional Information"
                    labelText="If you have answered YES to any of the above questions, please provide details"
                  />
                </div>

                <div className="grid grid-cols-4 col-span-4 gap-4 p-4 bg-gray-100 border rounded-lg">
                  {/* disability */}
                  <SelectInputBox
                    className="col-span-4"
                    value={
                      profileTemplate.questionnaireAnswers.c_disability
                        .q_disability === null
                        ? ""
                        : profileTemplate.questionnaireAnswers.c_disability
                              .q_disability
                          ? "yes"
                          : "no"
                    }
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        questionnaireAnswers: {
                          ...profileTemplate.questionnaireAnswers,
                          c_disability: {
                            ...profileTemplate.questionnaireAnswers
                              .c_disability,
                            q_disability:
                              value === null ? null : value === "yes",
                          },
                        },
                      });
                    }}
                    placeholder="Select Answer"
                    labelText="I consider myself to have a disability as defined by the Equality Act 2010 and would like my application to be considered under the Disability Confident Scheme"
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                    required
                    validating={validating}
                  />
                  <TextInputBox
                    className="col-span-4"
                    value={
                      profileTemplate.questionnaireAnswers.c_disability
                        .q_additionalInformation || ""
                    }
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        questionnaireAnswers: {
                          ...profileTemplate.questionnaireAnswers,
                          c_disability: {
                            ...profileTemplate.questionnaireAnswers
                              .c_disability,
                            q_additionalInformation: value,
                          },
                        },
                      });
                    }}
                    placeholder="Additional Information"
                    labelText="If you wish to provide further details, please do so here. This is not mandatory and will not affect your application."
                  />
                </div>

                <div className="grid grid-cols-4 col-span-4 gap-4 p-4 bg-gray-100 border rounded-lg">
                  {/* eligibility to work */}
                  <SelectInputBox
                    className="col-span-4"
                    value={
                      profileTemplate.questionnaireAnswers.c_eligibilityToWork
                        .q_eligibilityToWork === null
                        ? ""
                        : profileTemplate.questionnaireAnswers
                              .c_eligibilityToWork.q_eligibilityToWork
                          ? "yes"
                          : "no"
                    }
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        questionnaireAnswers: {
                          ...profileTemplate.questionnaireAnswers,
                          c_eligibilityToWork: {
                            ...profileTemplate.questionnaireAnswers
                              .c_eligibilityToWork,
                            q_eligibilityToWork:
                              value === null ? null : value === "yes",
                          },
                        },
                      });
                    }}
                    placeholder="Select Answer"
                    labelText="Do you currently have the right to work in the UK?"
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                    required
                    validating={validating}
                  />
                  <DatePicker
                    value={
                      profileTemplate.questionnaireAnswers.c_eligibilityToWork
                        .q_visaInformation
                        ? profileTemplate.questionnaireAnswers.c_eligibilityToWork.q_visaInformation.toISOString()
                        : ""
                    }
                    onChange={(value: Date) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        questionnaireAnswers: {
                          ...profileTemplate.questionnaireAnswers,
                          c_eligibilityToWork: {
                            ...profileTemplate.questionnaireAnswers
                              .c_eligibilityToWork,
                            q_visaInformation: value,
                          },
                        },
                      });
                    }}
                    labelText="If you hold a visa or other permission entitling you to work in the UK, when does it expire?"
                    className="col-span-4"
                  />
                  <TextInputBox
                    className="col-span-4"
                    value={
                      profileTemplate.questionnaireAnswers.c_eligibilityToWork
                        .q_additionalInformation || ""
                    }
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        questionnaireAnswers: {
                          ...profileTemplate.questionnaireAnswers,
                          c_eligibilityToWork: {
                            ...profileTemplate.questionnaireAnswers
                              .c_eligibilityToWork,
                            q_additionalInformation: value,
                          },
                        },
                      });
                    }}
                    placeholder="Additional Information"
                    labelText="Please provide any other information relating to your eligibility to work in the UK"
                  />
                </div>
                <div className="col-span-4" />
                <div className="col-span-1" />
                <div className="col-span-1" />
                <div className="col-span-1" />
                <div className="flex flex-row items-end h-full col-span-1 gap-x-2">
                  {/* <button
            className="w-full col-span-1 px-4 py-2 text-white transition-colors bg-red-700 rounded-lg hover:bg-red-600 disabled:bg-uos-lightgray"
            onClick={() => {
              if (confirmDelete) {
                // delete listing
                handleDelete();
                setConfirmDelete(false);
              } else {
                setConfirmDelete(true);
              }
            }}
            disabled={isLoadingUpdate || isLoadingDelete}
          >
            {confirmDelete ? "Confirm" : "Delete"}
          </button> */}
                  <button
                    className="w-full col-span-1 px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
                    onClick={() => {
                      handleSubmit1();
                    }}
                    disabled={isLoadingUpdate}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </AnimatePresence>
          </motion.div>
        )}
        {applicationStage === 2 && (
          <motion.div
            className="w-full"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            key="applicationReview"
          >
            <div className="flex flex-col items-center w-full mb-12">
              <h1 className="text-2xl font-normal text-uos-gray">
                Additional Information
              </h1>
              <p className="text-sm italic font-light text-uos-gray">
                Add your references, cover letter, and any other documents you
                want to include with your application.
              </p>
            </div>
            <div className="grid w-full grid-cols-4 gap-4">
              <div className="col-span-4">
                <hr className="my-4" />
                <h2 className="text-lg font-semibold text-uos-gray">
                  References
                </h2>
                <p className="text-sm italic font-light text-uos-gray">
                  Please provide details of at least two referees who can
                  provide references for you. One of these should be your
                  current or most recent employer.
                </p>
              </div>
              {profileTemplate.questionnaireAnswers.c_references.map(
                (reference, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 col-span-2 gap-4 p-2 bg-gray-100 border rounded-lg"
                  >
                    <TextInputBox
                      className="col-span-1"
                      value={reference.name || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          questionnaireAnswers: {
                            ...profileTemplate.questionnaireAnswers,
                            c_references: [
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                0,
                                index
                              ),
                              { ...reference, name: value },
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                index + 1
                              ),
                            ],
                          },
                        });
                      }}
                      placeholder="Name"
                      labelText="Name of Referee"
                      required
                      validating={validating}
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={reference.jobTitle || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          questionnaireAnswers: {
                            ...profileTemplate.questionnaireAnswers,
                            c_references: [
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                0,
                                index
                              ),
                              { ...reference, jobTitle: value },
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                index + 1
                              ),
                            ],
                          },
                        });
                      }}
                      placeholder="Job Title"
                      labelText="Job Title"
                      required
                      validating={validating}
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={reference.nameOfEmployer || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          questionnaireAnswers: {
                            ...profileTemplate.questionnaireAnswers,
                            c_references: [
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                0,
                                index
                              ),
                              { ...reference, nameOfEmployer: value },
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                index + 1
                              ),
                            ],
                          },
                        });
                      }}
                      placeholder="Name of Employer"
                      labelText="Name of Employer"
                      required
                      validating={validating}
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={reference.relationship || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          questionnaireAnswers: {
                            ...profileTemplate.questionnaireAnswers,
                            c_references: [
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                0,
                                index
                              ),
                              { ...reference, relationship: value },
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                index + 1
                              ),
                            ],
                          },
                        });
                      }}
                      placeholder="Relationship"
                      labelText="Relationship to You"
                      required
                      validating={validating}
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={reference.contactDetails.email || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          questionnaireAnswers: {
                            ...profileTemplate.questionnaireAnswers,
                            c_references: [
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                0,
                                index
                              ),
                              {
                                ...reference,
                                contactDetails: {
                                  ...reference.contactDetails,
                                  email: value,
                                },
                              },
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                index + 1
                              ),
                            ],
                          },
                        });
                      }}
                      placeholder="Email"
                      labelText="Email"
                    />
                    <TextInputBox
                      className="col-span-1"
                      value={reference.contactDetails.phone || ""}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          questionnaireAnswers: {
                            ...profileTemplate.questionnaireAnswers,
                            c_references: [
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                0,
                                index
                              ),
                              {
                                ...reference,
                                contactDetails: {
                                  ...reference.contactDetails,
                                  phone: value,
                                },
                              },
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                index + 1
                              ),
                            ],
                          },
                        });
                      }}
                      placeholder="Phone"
                      labelText="Phone"
                    />
                    <SelectInputBox
                      className="col-span-2"
                      value={reference.canContact ? "yes" : "no"}
                      onChange={(value) => {
                        setProfileTemplate({
                          ...profileTemplate,
                          questionnaireAnswers: {
                            ...profileTemplate.questionnaireAnswers,
                            c_references: [
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                0,
                                index
                              ),
                              { ...reference, canContact: value === "yes" },
                              ...profileTemplate.questionnaireAnswers.c_references.slice(
                                index + 1
                              ),
                            ],
                          },
                        });
                      }}
                      placeholder="Select Answer"
                      labelText="Can we approach the referee without consulting you beforehand?"
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                      required
                    />
                    <button
                      className="col-span-2 px-4 py-2 mt-auto text-white transition-colors bg-red-700 rounded-lg h-min hover:bg-red-600"
                      onClick={() => {
                        const newReferences = [
                          ...profileTemplate.questionnaireAnswers.c_references,
                        ];
                        newReferences.splice(index, 1);
                        setProfileTemplate({
                          ...profileTemplate,
                          questionnaireAnswers: {
                            ...profileTemplate.questionnaireAnswers,
                            c_references: newReferences,
                          },
                        });
                      }}
                    >
                      <p className="">Remove</p>
                    </button>
                  </div>
                )
              )}
              <div className="col-span-1">
                <button
                  className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
                  onClick={() => {
                    setProfileTemplate({
                      ...profileTemplate,
                      questionnaireAnswers: {
                        ...profileTemplate.questionnaireAnswers,
                        c_references: [
                          ...profileTemplate.questionnaireAnswers.c_references,
                          {
                            name: "",
                            jobTitle: "",
                            nameOfEmployer: "",
                            relationship: "",
                            contactDetails: {
                              email: "",
                              phone: "",
                            },
                            canContact: true,
                          },
                        ],
                      },
                    });
                  }}
                >
                  Add Reference
                </button>
              </div>
              <AnimatePresence>
                {validating &&
                  profileTemplate.questionnaireAnswers.c_references.length <
                    2 && (
                    <motion.p
                      className="col-span-1 text-sm text-red-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      You must provide at least two references.
                    </motion.p>
                  )}
              </AnimatePresence>
              <div className="col-span-4">
                <hr className="my-4" />
                <h2 className="text-lg font-semibold text-uos-gray">
                  Supporting Documents
                </h2>
                <p className="text-sm italic font-light text-uos-gray">
                  Include URLs to your CV, cover letter, or any other documents
                  you want to include with your application. Please make sure
                  the URLs are publicly accessible, or we won't be able to
                  access them.
                </p>
              </div>
              {profileTemplate.savedResources.map((document, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 col-span-2 gap-4 p-2 bg-gray-100 border rounded-lg"
                >
                  <TextInputBox
                    className="col-span-2"
                    value={document.resourceLink || ""}
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        savedResources: [
                          ...profileTemplate.savedResources.slice(0, index),
                          { ...document, resourceLink: value },
                          ...profileTemplate.savedResources.slice(index + 1),
                        ],
                      });
                    }}
                    placeholder="URL"
                    labelText="Document URL"
                    required
                    validating={validating}
                  />
                  <TextInputBox
                    className="col-span-1"
                    value={document.resourceTitle || ""}
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        savedResources: [
                          ...profileTemplate.savedResources.slice(0, index),
                          { ...document, resourceTitle: value },
                          ...profileTemplate.savedResources.slice(index + 1),
                        ],
                      });
                    }}
                    placeholder="Name"
                    labelText="Document Name"
                  />
                  <SelectInputBox
                    className="col-span-1"
                    value={document.resourceType || ""}
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        savedResources: [
                          ...profileTemplate.savedResources.slice(0, index),
                          { ...document, resourceType: value },
                          ...profileTemplate.savedResources.slice(index + 1),
                        ],
                      });
                    }}
                    placeholder="Select Type"
                    labelText="Document Type"
                    options={[
                      { value: "cv", label: "CV" },
                      { value: "coverLetter", label: "Cover Letter" },
                      { value: "other", label: "Other" },
                    ]}
                    required
                    validating={validating}
                  />
                  <TextInputBox
                    className="col-span-2"
                    value={document.resourceDescription || ""}
                    onChange={(value) => {
                      setProfileTemplate({
                        ...profileTemplate,
                        savedResources: [
                          ...profileTemplate.savedResources.slice(0, index),
                          { ...document, resourceDescription: value },
                          ...profileTemplate.savedResources.slice(index + 1),
                        ],
                      });
                    }}
                    placeholder="Description"
                    labelText="Document Description"
                    lineHeight={2}
                  />
                  <button
                    className="col-span-2 px-4 py-2 mt-auto text-white transition-colors bg-red-700 rounded-lg h-min hover:bg-red-600"
                    onClick={() => {
                      const newResources = [...profileTemplate.savedResources];
                      newResources.splice(index, 1);
                      setProfileTemplate({
                        ...profileTemplate,
                        savedResources: newResources,
                      });
                    }}
                  >
                    <p className="">Remove</p>
                  </button>
                </div>
              ))}
              <div className="col-span-1">
                <button
                  className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
                  onClick={() => {
                    setProfileTemplate({
                      ...profileTemplate,
                      savedResources: [
                        ...profileTemplate.savedResources,
                        {
                          resourceLink: "",
                          resourceTitle: "",
                          resourceType: "",
                          resourceDescription: "",
                        },
                      ],
                    });
                  }}
                >
                  Add Document
                </button>
              </div>
              <div className="col-span-4">
                <hr className="my-4" />
                <h2 className="text-lg font-semibold text-uos-gray">
                  Additional Notes
                </h2>
                <p className="text-sm italic font-light text-uos-gray">
                  Add any additional notes or information you want to tell us
                  about your application.
                </p>
              </div>
              <TextInputBox
                className="col-span-4"
                value={textContent}
                onChange={(value) => {
                  setTextContent(value);
                }}
                placeholder="Additional Notes"
                labelText="Additional Notes"
                supportsMarkdown
                lineHeight={4}
              />
              <div className="col-span-4" />
              <button
                className="w-full col-span-1 px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
                onClick={() => {
                  setApplicationStage(1);
                }}
              >
                Back
              </button>
              <div className="col-span-1" />
              <div className="col-span-1" />
              <div className="flex flex-row items-end h-full col-span-1 gap-x-2">
                {/* <button
            className="w-full col-span-1 px-4 py-2 text-white transition-colors bg-red-700 rounded-lg hover:bg-red-600 disabled:bg-uos-lightgray"
            onClick={() => {
              if (confirmDelete) {
                // delete listing
                handleDelete();
                setConfirmDelete(false);
              } else {
                setConfirmDelete(true);
              }
            }}
            disabled={isLoadingUpdate || isLoadingDelete}
            >
            {confirmDelete ? "Confirm" : "Delete"}
            </button> */}
                <button
                  className="w-full col-span-1 px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
                  onClick={() => {
                    handleSubmit2();
                  }}
                  disabled={isLoadingUpdate}
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {/* if stage is 3, show a message saying the application was submitted successfully */}
        {applicationStage === 3 && (
          <motion.div
            className="grid w-full grid-cols-4"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            key="applicationSubmitted"
          >
            <div className="flex flex-col items-center w-full col-span-4 mb-12">
              <h1 className="text-2xl font-normal text-uos-gray">
                Application Submitted
              </h1>
              <p className="text-sm italic font-light text-uos-gray">
                Your application was submitted successfully. You can view and
                manage your applications on your dashboard.
              </p>
            </div>
            {/* <div className="col-span-4" />
            <div className="col-span-1" />
            <div className="col-span-1" />
            <div className="col-span-1" /> */}
            <div className="flex flex-row items-end w-full h-full col-span-2 col-start-2 gap-x-2">
              <button
                className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
                onClick={() => {
                  navigate("/applications");
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationModal;
