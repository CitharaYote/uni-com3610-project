/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useEffect, useState } from "react";

// Package Imports

// Component Imports

// Asset Imports

export type SelectInputBoxProps = {
  className?: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange: (value: any) => void;
  placeholder?: string;
  labelText?: string;
  alignLabel?: "left" | "right" | "center";
  labelClassName?: string;
  required?: boolean;
  validating?: boolean;
  canSelectPlaceholder?: boolean;
};

/**
 * SelectInputBox renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const SelectInputBox = ({
  className,
  value,
  options,
  onChange,
  placeholder,
  labelText,
  alignLabel,
  labelClassName,
  required = false,
  validating = false,
  canSelectPlaceholder = false,
}: SelectInputBoxProps) => {
  const [focusError, setFocusError] = useState(false);

  useEffect(() => {
    // if validating is true and value is required and empty,
    // set focusError to true
    if (validating && required && value === "" && !canSelectPlaceholder) {
      setFocusError(true);
    } else {
      setFocusError(false);
    }
  }, [validating, required, value]);

  return (
    <div className={`${className} flex flex-col`}>
      <div
        className={`flex flex-row items-center justify-between mb-1 peer-hover:text-uos-purple transition ${focusError ? "text-red-600" : "text-uos-gray"}`}
      >
        {labelText && (
          <p className={`${labelClassName}`}>
            {labelText}
            {required && "*"}
          </p>
        )}
      </div>
      <select
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-uos-purple transition ${focusError ? "border-red-600 text-uos-darkgray" : "border-uos-gray text-uos-darkgray"}`}
        value={value}
        onChange={(e) => {
          onChange(
            canSelectPlaceholder && e.target.value === ""
              ? null
              : e.target.value
          );

          if (e.target.value === "" && !canSelectPlaceholder) {
            setFocusError(true);
          } else {
            setFocusError(false);
          }
        }}
        onBlur={() => {
          if (value === "" && !canSelectPlaceholder) {
            setFocusError(true);
          } else {
            setFocusError(false);
          }
        }}
      >
        {placeholder && (
          <option
            value=""
            disabled={!canSelectPlaceholder}
            className="text-uos-darkgray"
          >
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-uos-darkgray"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInputBox;
