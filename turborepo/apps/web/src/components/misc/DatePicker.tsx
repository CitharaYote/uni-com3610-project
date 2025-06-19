/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

// Package Imports
import React, { useState, useEffect } from "react";
import DatePickerPrefab from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Component Imports

// Asset Imports

export type DatePickerProps = {
  className?: string;
  value: string;
  onChange: (value: any) => void;
  placeholder?: string;
  labelText?: string;
  alignLabel?: "left" | "right" | "center";
  labelClassName?: string;
  required?: boolean;
  validating?: boolean;
};

const DatePicker = ({
  className,
  value,
  onChange,
  placeholder,
  labelText,
  alignLabel,
  labelClassName,
  required = false,
  validating = false,
}: DatePickerProps) => {
  const [focusError, setFocusError] = useState(false);

  useEffect(() => {
    // if validating is true and value is required and empty,
    // set focusError to true
    if (validating && required && value === "") {
      setFocusError(true);
    } else {
      setFocusError(false);
    }
  }, [validating, required, value]);

  return (
    <div className={`${className} flex flex-col`}>
      {labelText && (
        <p
          className={`${labelClassName} ${focusError ? "text-red-600" : "text-uos-gray"} mb-1`}
        >
          {labelText}
          {required && "*"}
        </p>
      )}
      <DatePickerPrefab
        selected={value !== "" ? new Date(value) : null}
        onChange={(date) => onChange(date)}
        className={`w-full px-2 py-2 transition-colors border border-uos-gray rounded-md focus:outline-none focus:border-uos-purple peer`}
        dateFormat={"dd/MM/yyyy"}
      />
    </div>
  );
};

export default DatePicker;
