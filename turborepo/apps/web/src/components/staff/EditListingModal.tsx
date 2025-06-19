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

// Package Imports

// Component Imports

// Asset Imports

export type EditListingModalProps = {
  className?: string;
  closeModal: () => void;
  targetListing: ListingType;
};

/**
 * EditListingModal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const EditListingModal = ({
  className,
  closeModal,
  targetListing,
}: EditListingModalProps) => {
  const dispatch = useDispatch();

  // get the new listing cache from the redux store

  const [listingTemplate, setListingTemplate] =
    useState<ListingType>(targetListing);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [
    updateListing,
    { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate },
  ] = useUpdateListingMutation();
  const [
    deleteListing,
    { isLoading: isLoadingDelete, isSuccess: isSuccessDelete },
  ] = useDeleteListingMutation();

  const handleSubmit = async () => {
    // check if required fields are filled in
    if (
      !listingTemplate.title ||
      !listingTemplate.description ||
      !listingTemplate.workingPattern ||
      !listingTemplate.jobType ||
      !listingTemplate.contractType ||
      !listingTemplate.location.remote ||
      !listingTemplate.dates.listingDate
    ) {
      return;
    }

    // create the listing
    console.log("sending listing");
    console.log(listingTemplate);

    const result = await updateListing(listingTemplate);
    console.log(result);

    if (result.error) {
      console.error(result.error);
    } else {
      closeModal();
    }

    // reset the form
  };

  const handleDelete = async () => {
    const result = await deleteListing(listingTemplate);
    console.log(result);

    if (result.error) {
      console.error(result.error);
    } else {
      closeModal();
    }
  };

  return (
    <div className={`${className} w-full pb-8 px-6`}>
      <p className="mb-4 text-sm italic text-uos-gray">
        All fields marked with * are required.
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
          ]}
          required
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
          placeholder="Select Salary Type"
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
          placeholder="Select Hidden"
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
          </button>
          <button
            className="w-full col-span-1 px-4 py-2 text-white transition-colors rounded-lg bg-uos-purple hover:bg-uos-purple-hover disabled:bg-uos-lightgray"
            onClick={() => handleSubmit()}
            disabled={isLoadingUpdate || isLoadingDelete}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditListingModal;
