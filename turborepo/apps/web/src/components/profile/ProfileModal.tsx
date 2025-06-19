/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useEffect, useState } from "react";
import TextInputBox from "../misc/TextInputBox";
import SelectInputBox from "../misc/SelectInputBox";
import ListingType from "../../types/ListingType";
import currencySymbols from "../../utils/conversions/currencySymbols";

import DatePicker from "../misc/DatePicker";
import {
  useUpdateListingMutation,
  useDeleteListingMutation,
} from "../../redux/listings/listingsApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNewListingCache,
  selectNewListingCache,
  setNewListingCache,
} from "../../redux/listings/listingsSlice";
import ProfileType from "../../types/ProfileType";
import { useUpdateProfileMutation } from "../../redux/profile/profileApiSlice";
import { ResumeDropzone } from "../../resume-parser/ResumeDropzone";
import { TextItems } from "../../resume-parser/parse-resume-from-pdf/types";
import { readPdf } from "../../resume-parser/parse-resume-from-pdf/read-pdf";
import { groupLinesIntoSections } from "../../resume-parser/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "../../resume-parser/parse-resume-from-pdf/extract-resume-from-sections";
import { groupTextItemsIntoLines } from "../../resume-parser/parse-resume-from-pdf/group-text-items-into-lines";

// Package Imports

// Component Imports

// Asset Imports

export type ProfileModalProps = {
  className?: string;
  closeModal: () => void;
  targetProfile: ProfileType;
};

/**
 * ProfileModal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const ProfileModal = ({
  className,
  closeModal,
  targetProfile,
}: ProfileModalProps) => {
  const dispatch = useDispatch();

  // get the new listing cache from the redux store

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

  const [profileTemplate, setProfileTemplate] = useState<ProfileType>(
    Object.keys(targetProfile).length === 0 ||
      (Object.keys(targetProfile).length < 7 &&
        targetProfile.education.length === 0 &&
        targetProfile.workExperience.length === 0 &&
        targetProfile.savedResources.length === 0)
      ? blankProfile
      : targetProfile
  );

  const [
    updateProfile,
    { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate },
  ] = useUpdateProfileMutation();

  const [validating, setValidating] = useState(false);

  const handleSubmit = async () => {
    // check if required fields are filled in
    // if (
    //   !profileTemplate.title ||
    //   !profileTemplate.description ||
    //   !profileTemplate.workingPattern ||
    //   !profileTemplate.jobType ||
    //   !profileTemplate.contractType ||
    //   !profileTemplate.location.remote ||
    //   !profileTemplate.dates.listingDate
    // ) {
    //   return;
    // }

    if (
      !profileTemplate.names.first ||
      !profileTemplate.names.last ||
      !profileTemplate.contactDetails.email
    ) {
      setValidating(true);
      return;
    }

    // create the listing
    console.log("sending listing");
    console.log(profileTemplate);

    const result = await updateProfile({ profile: profileTemplate });
    console.log(result);

    if (result.error) {
      console.error(result.error);
    } else {
      closeModal();
    }

    // reset the form
  };

  const [fileUrl, setFileUrl] = useState("");

  const [textItems, setTextItems] = useState<TextItems>([]);
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  useEffect(() => {
    async function test() {
      if (!fileUrl || fileUrl === "") return;
      const textItems = await readPdf(fileUrl);
      setTextItems(textItems);
    }
    test();
  }, [fileUrl]);

  // useEffect(() => {
  //   console.log(resume);
  // }, [resume]);

  const tryParseDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (date.toString() === "Invalid Date") {
        return new Date();
      }
    } catch (e) {
      return new Date();
    }
  };

  const parseResumeData = () => {
    // convert the resume data to the profile template
    setProfileTemplate({
      ...profileTemplate,
      names: {
        first: resume.profile.name.split(" ")[0],
        last: resume.profile.name.split(" ")[
          resume.profile.name.split(" ").length - 1
        ],
        other:
          resume.profile.name.split(" ").length > 2
            ? resume.profile.name.split(" ").slice(1, -1).join(" ")
            : "",
      },
      contactDetails: {
        email: resume.profile.email,
        phone: resume.profile.phone,
      },
      address: {
        house: "",
        street: "",
        city: "",
        country: resume.profile.location,
        postcode: "",
      },
      education: resume.educations.map((education) => ({
        institution: education.school,
        qualification: education.degree,
        period: {
          start: tryParseDate(education.date),
          end: null,
        },
        subject: null,
        grade: education.gpa,
        country: null,
      })),
      workExperience: resume.workExperiences.map((experience) => ({
        company: experience.company,
        jobTitle: experience.jobTitle,
        period: {
          start: tryParseDate(experience.date),
          end: null,
        },
        country: null,
        noticePeriod: null,
        description: experience.descriptions.join("\n"),
        salary: null,
        reasonForLeaving: null,
      })),
    });
  };

  return (
    <div className={`${className} w-full pb-8 px-6`}>
      <p className="mb-4 text-sm italic text-uos-gray">
        All fields marked with * are required. Information you enter here will
        be used to autofill applications, but you'll always have the chance to
        review and edit before submitting.
      </p>
      <p className="mb-4 text-sm italic text-uos-gray">
        All information will be stored securely and can not be accessed by any
        staff outside of those involved in the recruitment process for jobs
        you've submitted applications to, or any third parties.
      </p>
      <div className="grid w-full grid-cols-4 gap-4">
        <div className="grid grid-cols-4 col-span-4 gap-4">
          <hr className="col-span-4 my-4" />
          <div className="col-span-2">
            <h2 className="text-lg font-semibold text-uos-gray">
              Import from PDF
            </h2>
            <p className="text-sm text-uos-gray">
              Import your CV from a PDF file to autofill your profile. This may
              return incorrect data however, so please check and edit all fields
              before submitting.
            </p>
          </div>
          <div className="col-span-2 gap-y-2">
            <ResumeDropzone
              onFileUrlChange={(fileUrl) => setFileUrl(fileUrl || "")}
              playgroundView={true}
              className="mb-4"
            />
            <button
              className="float-right col-span-2 px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
              onClick={parseResumeData}
            >
              Import Data
            </button>
          </div>
        </div>

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
          placeholder="Phone"
          labelText="Phone"
        />
        <div className="col-span-4">
          <hr className="my-4" />
          <h2 className="text-lg font-semibold text-uos-gray">Address</h2>
        </div>
        <TextInputBox
          className="col-span-1"
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
        />
        <TextInputBox
          className="col-span-3"
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
        />
        <div className="col-span-4">
          <hr className="my-4" />
          <h2 className="text-lg font-semibold text-uos-gray">Education</h2>
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
          <h2 className="text-lg font-semibold text-uos-gray">Experience</h2>
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
                { value: "careerProgression", label: "Career Progression" },
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
                const newExperience = [...profileTemplate.workExperience];
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
                : profileTemplate.questionnaireAnswers.c_criminalConvictions
                      .q_unspentConvictions
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
            canSelectPlaceholder
          />
          {/* spent convictions */}
          <SelectInputBox
            className="col-span-4"
            value={
              profileTemplate.questionnaireAnswers.c_criminalConvictions
                .q_spentConvictions === null
                ? ""
                : profileTemplate.questionnaireAnswers.c_criminalConvictions
                      .q_spentConvictions
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
                    q_spentConvictions: value === null ? null : value === "yes",
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
            canSelectPlaceholder
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
              profileTemplate.questionnaireAnswers.c_disability.q_disability ===
              null
                ? ""
                : profileTemplate.questionnaireAnswers.c_disability.q_disability
                  ? "yes"
                  : "no"
            }
            onChange={(value) => {
              setProfileTemplate({
                ...profileTemplate,
                questionnaireAnswers: {
                  ...profileTemplate.questionnaireAnswers,
                  c_disability: {
                    ...profileTemplate.questionnaireAnswers.c_disability,
                    q_disability: value === null ? null : value === "yes",
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
            canSelectPlaceholder
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
                    ...profileTemplate.questionnaireAnswers.c_disability,
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
                : profileTemplate.questionnaireAnswers.c_eligibilityToWork
                      .q_eligibilityToWork
                  ? "yes"
                  : "no"
            }
            onChange={(value) => {
              setProfileTemplate({
                ...profileTemplate,
                questionnaireAnswers: {
                  ...profileTemplate.questionnaireAnswers,
                  c_eligibilityToWork: {
                    ...profileTemplate.questionnaireAnswers.c_eligibilityToWork,
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
            canSelectPlaceholder
          />
          {/* <TextInputBox
            className="col-span-4"
            value={
              profileTemplate.questionnaireAnswers.c_eligibilityToWork
                .q_visaInformation || ""
            }
            onChange={(value) => {
              setProfileTemplate({
                ...profileTemplate,
                questionnaireAnswers: {
                  ...profileTemplate.questionnaireAnswers,
                  c_eligibilityToWork: {
                    ...profileTemplate.questionnaireAnswers.c_eligibilityToWork,
                    q_visaInformation: value,
                  },
                },
              });
            }}
            placeholder="Visa Information"
            labelText="Please provide any other information relating to your eligibility to work in the UK"
          /> */}
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
                    ...profileTemplate.questionnaireAnswers.c_eligibilityToWork,
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
                    ...profileTemplate.questionnaireAnswers.c_eligibilityToWork,
                    q_additionalInformation: value,
                  },
                },
              });
            }}
            placeholder="Additional Information"
            labelText="Please provide any other information relating to your eligibility to work in the UK"
          />
        </div>

        {/* <TextInputBox
          className="col-span-2"
          value={profileTemplate.title}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              title: value,
            })
          }
          placeholder="Job Title"
          labelText="Job Title"
          required
        />
        <TextInputBox
          className="col-span-2"
          value={profileTemplate.reference}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              reference: value,
            })
          }
          placeholder="Reference"
          labelText="Reference"
        />
        <TextInputBox
          className="col-span-4"
          value={profileTemplate.description}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              description: value,
            })
          }
          placeholder="Job Description"
          labelText="Job Description"
          supportsMarkdown
          lineHeight={12}
          required
        />
        <SelectInputBox
          className="col-span-2"
          value={profileTemplate.jobType}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              jobType: value,
            })
          }
          placeholder="Select a Job Type"
          labelText="Job Type"
          options={[
            { value: "academic", label: "Academic" },
            { value: "clerical", label: "Clerical & Secreterial" },
            { value: "clinical", label: "Clinical & Health" },
            { value: "facilities", label: "Facilities Support" },
            {
              value: "management",
              label: "Management, Administrative & Professional",
            },
            { value: "research", label: "Research" },
            { value: "teaching", label: "Teaching" },
            { value: "technical", label: "Technical" },
            { value: "other", label: "Other" },
          ]}
          required
        />
        <TextInputBox
          className="col-span-2"
          value={profileTemplate.tags.join(", ")}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              tags: value.replace(/\s/g, "").split(","),
            })
          }
          placeholder="Tags (comma separated)"
          labelText="Tags"
        />
        <SelectInputBox
          className="col-span-2"
          value={profileTemplate.workingPattern}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              workingPattern: value,
            })
          }
          placeholder="Select a Working Pattern"
          labelText="Working Pattern"
          options={[
            { value: "full-time", label: "Full-Time" },
            { value: "part-time", label: "Part-Time" },
            { value: "flexible", label: "Flexible" },
            { value: "contract", label: "Contract" },
            { value: "temporary", label: "Temporary" },
            { value: "internship", label: "Internship" },
            { value: "apprenticeship", label: "Apprenticeship" },
            { value: "volunteer", label: "Volunteer" },
          ]}
          required
        />
        <SelectInputBox
          className="col-span-2"
          value={profileTemplate.contractType}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              contractType: value,
            })
          }
          placeholder="Select a Contract Type"
          labelText="Contract Type"
          options={[
            { value: "permanent", label: "Permanent" },
            { value: "fixed-term", label: "Fixed-Term" },
            { value: "open-ended", label: "Open-Ended" },
            { value: "other", label: "Other" },
          ]}
          required
        />
        <TextInputBox
          className="col-span-2"
          value={profileTemplate.faculty}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              faculty: value,
            })
          }
          placeholder="Faculty"
          labelText="Faculty"
        />
        <TextInputBox
          className="col-span-2"
          value={profileTemplate.department}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              department: value,
            })
          }
          placeholder="Department"
          labelText="Department"
        />
        <div className="col-span-4">
          <hr className="my-4" />
          <h2 className="text-lg font-semibold text-uos-gray">Location</h2>
        </div>
        <SelectInputBox
          className="col-span-2"
          value={profileTemplate.location.remote}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              location: {
                ...profileTemplate.location,
                remote: value,
              },
            })
          }
          placeholder="Select Location"
          labelText="Location Type"
          options={[
            { value: "on-site", label: "On-Site" },
            { value: "remote", label: "Remote" },
            { value: "hybrid", label: "Hybrid" },
            { value: "other", label: "Other" },
          ]}
          required
        />
        <TextInputBox
          className="col-span-2"
          value={profileTemplate.location.locationName}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              location: {
                ...profileTemplate.location,
                locationName: value,
              },
            })
          }
          placeholder="Location"
          labelText="Location (if applicable)"
        />
        <div className="col-span-4">
          <hr className="my-4" />
          <h2 className="text-lg font-semibold text-uos-gray">Dates</h2>
        </div>
        <DatePicker
          value={profileTemplate.dates.listingDate}
          onChange={(value: Date) =>
            setProfileTemplate({
              ...profileTemplate,
              dates: {
                ...profileTemplate.dates,
                listingDate: value.toISOString(),
              },
            })
          }
          labelText="Listing Date"
          required
        />
        <DatePicker
          value={profileTemplate.dates.closingDate}
          onChange={(value: Date) =>
            setProfileTemplate({
              ...profileTemplate,
              dates: {
                ...profileTemplate.dates,
                closingDate: value.toISOString(),
              },
            })
          }
          labelText="Closing Date"
        />
        <SelectInputBox
          className="col-span-1"
          value={profileTemplate.dates.hideClosingDate ? "true" : "false"}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              dates: {
                ...profileTemplate.dates,
                hideClosingDate: value === "true",
              },
            })
          }
          placeholder="Select Hidden"
          labelText="Hide Closing Date"
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
        />
        <div className="col-span-4">
          <hr className="my-4" />
          <h2 className="text-lg font-semibold text-uos-gray">
            Salary Information
          </h2>
        </div>
        <TextInputBox
          className="col-span-1"
          value={profileTemplate.salary.min || ""}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              salary: {
                ...profileTemplate.salary,
                min: parseInt(value),
              },
            })
          }
          placeholder="Minimum Salary"
          labelText={`Minimum Salary${" (" + currencySymbols[profileTemplate.salary.currency] + ")"}`}
          type="number"
        />
        <TextInputBox
          className="col-span-1"
          value={profileTemplate.salary.max || ""}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              salary: {
                ...profileTemplate.salary,
                max: parseInt(value),
              },
            })
          }
          placeholder="Maximum Salary"
          labelText={`Maximum Salary${" (" + currencySymbols[profileTemplate.salary.currency] + ")"}`}
          type="number"
        />
        <TextInputBox
          className="col-span-1"
          value={profileTemplate.salary.potentialMax || ""}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              salary: {
                ...profileTemplate.salary,
                potentialMax: parseInt(value),
              },
            })
          }
          placeholder="Potential Salary"
          labelText={`Potential Salary${" (" + currencySymbols[profileTemplate.salary.currency] + ")"}`}
          type="number"
        />
        <TextInputBox
          className="col-span-1"
          value={profileTemplate.salary.grade}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              salary: {
                ...profileTemplate.salary,
                grade: value,
              },
            })
          }
          placeholder="Salary Grade"
          labelText="Salary Grade"
        />
        <SelectInputBox
          className="col-span-1"
          value={profileTemplate.salary.currency}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              salary: {
                ...profileTemplate.salary,
                currency: value,
              },
            })
          }
          placeholder="Select Currency"
          labelText="Currency"
          options={[
            { value: "GBP", label: currencySymbols.GBP },
            { value: "USD", label: currencySymbols.USD },
            { value: "EUR", label: currencySymbols.EUR },
          ]}
        />
        <SelectInputBox
          className="col-span-1"
          value={profileTemplate.salary.proRata ? "true" : "false"}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              salary: {
                ...profileTemplate.salary,
                proRata: value === "true",
              },
            })
          }
          placeholder="Select Salary Type"
          labelText="Salary Type"
          options={[
            { value: "false", label: "Per Annum" },
            { value: "true", label: "Pro Rata" },
          ]}
        />
        <SelectInputBox
          className="col-span-1"
          value={profileTemplate.salary.hidden ? "true" : "false"}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              salary: {
                ...profileTemplate.salary,
                hidden: value === "true",
              },
            })
          }
          placeholder="Select Hidden"
          labelText="Hide Salary"
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
        />
        <div className="col-span-4">
          <hr className="my-4" />
          <h2 className="text-lg font-semibold text-uos-gray">Final Checks</h2>
        </div>
        <SelectInputBox
          className="col-span-1"
          value={profileTemplate.visible ? "true" : "false"}
          onChange={(value) =>
            setProfileTemplate({
              ...profileTemplate,
              visible: value === "true",
            })
          }
          placeholder="Select Hidden"
          labelText="Save as Draft"
          options={[
            { value: "false", label: "Yes" },
            { value: "true", label: "No" },
          ]}
        /> */}
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
            onClick={() => handleSubmit()}
            disabled={isLoadingUpdate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
