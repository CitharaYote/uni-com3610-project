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
import { useCreateListingMutation } from "../../redux/listings/listingsApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNewListingCache,
  selectNewListingCache,
  setNewListingCache,
} from "../../redux/listings/listingsSlice";
import { randomJobData } from "../../utils/constants";

// Package Imports

// Component Imports

// Asset Imports

export type NewListingModalProps = {
  className?: string;
  closeModal: () => void;
};

/**
 * NewListingModal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const NewListingModal = ({ className, closeModal }: NewListingModalProps) => {
  const dispatch = useDispatch();

  // get the new listing cache from the redux store
  const newListingCache = useSelector(selectNewListingCache);

  const [listingTemplate, setListingTemplate] =
    useState<ListingType>(newListingCache);

  useEffect(() => {
    dispatch(setNewListingCache(listingTemplate));
  }, [listingTemplate]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [validating, setValidating] = useState(false);

  const [createListing, { isLoading, error }] = useCreateListingMutation();

  const handleSubmit = async () => {
    // check if required fields are filled in
    if (
      !listingTemplate.title ||
      !listingTemplate.description ||
      !listingTemplate.workingPattern ||
      !listingTemplate.jobType ||
      !listingTemplate.workingPattern ||
      !listingTemplate.contractType ||
      !listingTemplate.location.remote ||
      !listingTemplate.dates.listingDate
    ) {
      setValidating(true);
      return;
    }

    // create the listing
    console.log("sending listing");
    console.log(listingTemplate);

    const result = await createListing(listingTemplate);
    console.log(result);

    if (result.error) {
      console.error(result.error);
    } else {
      dispatch(clearNewListingCache());
      closeModal();
    }

    // reset the form
  };

  const handleReset = async () => {
    await dispatch(clearNewListingCache());
    setListingTemplate(newListingCache);
  };

  const generateRandomJob = () => {
    const workingPatternOptions = [
      "full-time",
      "part-time",
      "flexible",
      "contract",
      "temporary",
      "internship",
      "apprenticeship",
      "volunteer",
      "other",
    ];
    const jobTypeOptions = [
      "academic",
      "clerical",
      "clinical",
      "facilities",
      "management",
      "research",
      "teaching",
      "technical",
      "other",
    ];
    const contractTypeOptions = [
      "permanent",
      "fixed-term",
      "open-ended",
      "other",
    ];
    const currencyOptions = ["GBP", "USD", "EUR"];
    const remoteOptions = ["remote", "on-site", "hybrid", "other"];

    const randomMin = Math.floor(Math.random() * 100000);
    const randomMax = randomMin + Math.floor(Math.random() * 10000);
    const randomPotentialMax = randomMax + Math.floor(Math.random() * 100000);

    const randomJob: ListingType = {
      // for the title, generate any combination of prefix, middle and suffix from the randomJobData object
      // so there could be all 3, or just a prefix and a suffix, etc.
      title: `${Math.floor(Math.random() * 3) !== 1 ? randomJobData.title.prefix[Math.floor(Math.random() * randomJobData.title.prefix.length)] : ""} ${Math.floor(Math.random() * 5) !== 1 ? randomJobData.title.middle[Math.floor(Math.random() * randomJobData.title.middle.length)] : ""} ${Math.floor(Math.random() * 3) !== 1 ? randomJobData.title.suffix[Math.floor(Math.random() * randomJobData.title.suffix.length)] : ""}`,
      // for description, generate a paragraph with a random number of sentences (max 5)
      description: randomJobData.description
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 4) + 1)
        .join("\n\n"),
      // for tags, generate a random number of tags (max 5)
      tags: randomJobData.tags
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 5)),
      // for faculty, generate a random faculty
      faculty:
        randomJobData.faculty[
          Math.floor(Math.random() * randomJobData.faculty.length)
        ],
      // for department, generate a random department
      department:
        randomJobData.department[
          Math.floor(Math.random() * randomJobData.department.length)
        ],
      // for location, generate a random location type
      location: {
        // remote: ListingType.location.remote[Math.floor(Math.random() * ListingType.location.remote.length)],
        remote: remoteOptions[Math.floor(Math.random() * remoteOptions.length)],
        locationName:
          randomJobData.location[
            Math.floor(Math.random() * randomJobData.location.length)
          ],
        linkedLocationId: "",
      },
      // for salary, generate a random salary
      salary: {
        min: randomMin,
        // add a random value to the min salary to create a max salary
        max: Math.random() > 0.3 ? randomMax : undefined,
        potentialMax: Math.random() > 0.7 ? randomPotentialMax : undefined,
        grade: Math.floor(Math.random() * 10).toString(),
        currency:
          currencyOptions[Math.floor(Math.random() * currencyOptions.length)],
        proRata: Math.floor(Math.random() * 2) === 1,
        hidden: Math.floor(Math.random() * 5) === 1,
      },
      // for dates, generate a random listing date and closing date
      dates: {
        listingDate: new Date(
          new Date().setDate(
            new Date().getDate() - Math.floor(Math.random() * 10000)
          )
        ).toISOString(),
        closingDate: new Date(
          new Date().setDate(
            new Date().getDate() + Math.floor(Math.random() * 10000)
          )
        ).toISOString(),
        hideClosingDate: Math.floor(Math.random() * 5) !== 1,
      },
      // for working pattern, generate a random working pattern
      workingPattern:
        workingPatternOptions[
          Math.floor(Math.random() * workingPatternOptions.length)
        ],
      // for job type, generate a random job type
      jobType:
        jobTypeOptions[Math.floor(Math.random() * jobTypeOptions.length)],
      // for contract type, generate a random contract type
      contractType:
        contractTypeOptions[
          Math.floor(Math.random() * contractTypeOptions.length)
        ],
      // for visible, generate a random boolean
      visible: Math.floor(Math.random() * 5) !== 1,
      ranking: [],
      notifications: [],
    };
    // if the title is just whitespace (ie. all the random parts are empty), add a random job to the title
    if (randomJob.title.trim() === "") {
      randomJob.title =
        randomJobData.title.prefix[
          Math.floor(Math.random() * randomJobData.title.prefix.length)
        ];
    }
    setListingTemplate(randomJob);
  };

  return (
    <div className={`${className} w-full pb-8 px-6`}>
      <p
        className="mb-4 text-sm italic text-uos-gray"
        onClick={generateRandomJob}
      >
        All fields marked with * are required. You can leave this page and come
        back to it later, your changes will be saved until you hit 'Clear'.
      </p>
      <div className="grid w-full grid-cols-4 gap-4">
        <TextInputBox
          className="col-span-2"
          value={listingTemplate.title}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              title: value,
            })
          }
          placeholder="Job Title"
          labelText="Job Title"
          required
          validating={validating}
        />
        <TextInputBox
          className="col-span-2"
          value={listingTemplate.reference}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              reference: value,
            })
          }
          placeholder="Reference"
          labelText="Reference"
        />
        <TextInputBox
          className="col-span-4"
          value={listingTemplate.description}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              description: value,
            })
          }
          placeholder="Job Description"
          labelText="Job Description"
          supportsMarkdown
          lineHeight={12}
          required
          validating={validating}
        />
        <SelectInputBox
          className="col-span-2"
          value={listingTemplate.jobType}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
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
          validating={validating}
        />
        <TextInputBox
          className="col-span-2"
          value={listingTemplate.tags.join(", ")}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              tags: value.replace(/\s/g, "").split(","),
            })
          }
          placeholder="Tags (comma separated)"
          labelText="Tags"
        />
        <SelectInputBox
          className="col-span-2"
          value={listingTemplate.workingPattern}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
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
            { value: "other", label: "Other" },
          ]}
          required
          validating={validating}
        />
        <SelectInputBox
          className="col-span-2"
          value={listingTemplate.contractType}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
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
          validating={validating}
        />
        <TextInputBox
          className="col-span-2"
          value={listingTemplate.faculty}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              faculty: value,
            })
          }
          placeholder="Faculty"
          labelText="Faculty"
        />
        <TextInputBox
          className="col-span-2"
          value={listingTemplate.department}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
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
          value={listingTemplate.location.remote}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              location: {
                ...listingTemplate.location,
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
          validating={validating}
        />
        <TextInputBox
          className="col-span-2"
          value={listingTemplate.location.locationName}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              location: {
                ...listingTemplate.location,
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
          <p className="text-sm italic text-uos-gray">
            Listing Date is the date the job will become visible to applicants.
            Closing Date is the date the final applications will be accepted.
            You can also optionally hide the closing date from applicants.
          </p>
        </div>
        <DatePicker
          value={listingTemplate.dates.listingDate}
          onChange={(value: Date) =>
            setListingTemplate({
              ...listingTemplate,
              dates: {
                ...listingTemplate.dates,
                listingDate: value.toISOString(),
              },
            })
          }
          labelText="Listing Date"
          required
          validating={validating}
        />
        <DatePicker
          value={listingTemplate.dates.closingDate}
          onChange={(value: Date) =>
            setListingTemplate({
              ...listingTemplate,
              dates: {
                ...listingTemplate.dates,
                closingDate: value.toISOString(),
              },
            })
          }
          labelText="Closing Date"
        />
        <SelectInputBox
          className="col-span-1"
          value={listingTemplate.dates.hideClosingDate ? "true" : "false"}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              dates: {
                ...listingTemplate.dates,
                hideClosingDate: value === "true",
              },
            })
          }
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
          value={listingTemplate.salary.min || ""}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              salary: {
                ...listingTemplate.salary,
                min: parseInt(value),
              },
            })
          }
          placeholder="Minimum Salary"
          labelText={`Minimum Salary${" (" + currencySymbols[listingTemplate.salary.currency] + ")"}`}
          type="number"
        />
        <TextInputBox
          className="col-span-1"
          value={listingTemplate.salary.max || ""}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              salary: {
                ...listingTemplate.salary,
                max: parseInt(value),
              },
            })
          }
          placeholder="Maximum Salary"
          labelText={`Maximum Salary${" (" + currencySymbols[listingTemplate.salary.currency] + ")"}`}
          type="number"
        />
        <TextInputBox
          className="col-span-1"
          value={listingTemplate.salary.potentialMax || ""}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              salary: {
                ...listingTemplate.salary,
                potentialMax: parseInt(value),
              },
            })
          }
          placeholder="Potential Salary"
          labelText={`Potential Salary${" (" + currencySymbols[listingTemplate.salary.currency] + ")"}`}
          type="number"
        />
        <TextInputBox
          className="col-span-1"
          value={listingTemplate.salary.grade}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              salary: {
                ...listingTemplate.salary,
                grade: value,
              },
            })
          }
          placeholder="Salary Grade"
          labelText="Salary Grade"
        />
        <SelectInputBox
          className="col-span-1"
          value={listingTemplate.salary.currency}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              salary: {
                ...listingTemplate.salary,
                currency: value,
              },
            })
          }
          labelText="Currency"
          options={[
            { value: "GBP", label: currencySymbols.GBP },
            { value: "USD", label: currencySymbols.USD },
            { value: "EUR", label: currencySymbols.EUR },
          ]}
        />
        <SelectInputBox
          className="col-span-1"
          value={listingTemplate.salary.proRata ? "true" : "false"}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              salary: {
                ...listingTemplate.salary,
                proRata: value === "true",
              },
            })
          }
          labelText="Salary Type"
          options={[
            { value: "false", label: "Per Annum" },
            { value: "true", label: "Pro Rata" },
          ]}
        />
        <SelectInputBox
          className="col-span-1"
          value={listingTemplate.salary.hidden ? "true" : "false"}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              salary: {
                ...listingTemplate.salary,
                hidden: value === "true",
              },
            })
          }
          labelText="Hide Salary"
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
        />
        <div className="col-span-4">
          <hr className="my-4" />
          <h2 className="text-lg font-semibold text-uos-gray">Final Checks</h2>
          <p className="text-sm italic text-uos-gray">
            Saving a listing as a draft will hide it from the public until you
            are ready to publish it. Other staff members will still be able to
            view the listing regardless of its visibility.
          </p>
        </div>
        <SelectInputBox
          className="col-span-1"
          value={listingTemplate.visible ? "true" : "false"}
          onChange={(value) =>
            setListingTemplate({
              ...listingTemplate,
              visible: value === "true",
            })
          }
          labelText="Save as Draft"
          options={[
            { value: "false", label: "Yes" },
            { value: "true", label: "No" },
          ]}
        />
        <div className="grid-cols-1" />
        <div className="grid-cols-1" />
        <div className="flex flex-row items-end h-full grid-cols-1 gap-x-2">
          <button
            className="w-full col-span-1 px-4 py-2 text-white transition-colors bg-red-700 rounded-lg hover:bg-red-600"
            onClick={() => {
              if (confirmDelete) {
                // handleReset();
                dispatch(clearNewListingCache());
                setListingTemplate({
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
                  notifications: [],
                  visible: false,
                  postedBy: "",
                  savedBy: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  panelMembers: [],
                  archived: false,
                });
                setConfirmDelete(false);
              } else {
                setConfirmDelete(true);
              }
            }}
          >
            {confirmDelete ? "Confirm" : "Clear"}
          </button>
          <button
            className="w-full col-span-1 px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
            onClick={() => handleSubmit()}
            disabled={isLoading}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewListingModal;
