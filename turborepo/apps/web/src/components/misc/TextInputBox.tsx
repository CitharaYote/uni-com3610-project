/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import MarkdownEditor from "@uiw/react-markdown-editor";
import { useEffect, useState } from "react";

// Package Imports

// Component Imports

// Asset Imports

export type TextInputBoxProps = {
  className?: string;
  value?: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  labelText?: string;
  alignLabel?: "left" | "right" | "center";
  labelClassName?: string;
  supportsMarkdown?: boolean;
  lineHeight?: number;
  required?: boolean;
  type?: "text" | "password" | "email" | "number" | "username"; // type only affects single line non-markdown inputs
  validating?: boolean;
  isEmail?: boolean;
};

/**
 * TextInputBox renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const TextInputBox = ({
  className,
  value,
  onChange,
  placeholder,
  labelText,
  alignLabel,
  labelClassName,
  supportsMarkdown = false,
  lineHeight = 1,
  required = false,
  type = "text",
  validating = false,
  isEmail = false,
}: TextInputBoxProps) => {
  const [markdownEnabled, setMarkdownEnabled] = useState(false);
  //   const [markdownContent, setMarkdownContent] = useState(value);

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

  const validateNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/;
    if (value === "") {
      return 0;
    }
    if (regex.test(value)) {
      if (parseInt(value) < 0) {
        return 0;
      }
      return parseInt(value);
    }
  };

  return (
    <div className={`${className} flex flex-col`}>
      <div className="flex flex-row items-center justify-between mb-1 peer-hover:text-uos-purple text-uos-gray">
        {labelText && (
          <p className={`${labelClassName} ${focusError && "text-red-600"}`}>
            {labelText}
            {required && "*"}
          </p>
        )}
        {supportsMarkdown && (
          <div className="flex flex-row items-center">
            <a
              href="https://www.markdownguide.org/basic-syntax/"
              target="_blank"
              className="h-full text-sm underline transition-colors text-uos-purple"
            >
              Markdown Supported!
            </a>
            <input
              type="checkbox"
              className="w-4 h-4 ml-2"
              checked={markdownEnabled}
              onChange={() => setMarkdownEnabled(!markdownEnabled)}
            />
          </div>
        )}
      </div>
      {supportsMarkdown && markdownEnabled && (
        <MarkdownEditor
          value={value?.toString() || ""} // should fix number type error
          onChange={(value) => {
            onChange(value);
            setFocusError(false);
          }}
          height={`${lineHeight * 2 - 3.7}rem`}
          className={`${focusError ? "border-red-600" : ""}`}
          visible={true}
          previewProps={{ className: "markdown" }}
        />
      )}
      {supportsMarkdown && !markdownEnabled && (
        <textarea
          className={`w-full px-2 py-2 transition-colors border rounded-md  focus:outline-none focus:border-uos-purple peer ${focusError ? "border-red-600" : "border-uos-gray"}`}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setFocusError(false);
          }}
          placeholder={placeholder}
          rows={lineHeight}
          onBlur={(e) => {
            if (required && value === "") {
              setFocusError(true);
            }
          }}
        />
      )}
      {!supportsMarkdown &&
        (lineHeight > 1 ? (
          <textarea
            className={`w-full px-2 py-2 transition-colors border rounded-md  focus:outline-none focus:border-uos-purple peer ${focusError ? "border-red-600" : "border-uos-gray"}`}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setFocusError(false);
            }}
            placeholder={placeholder}
            rows={lineHeight}
            onBlur={(e) => {
              if (required && value === "") {
                setFocusError(true);
              }
            }}
          />
        ) : (
          <input
            className={`w-full px-2 py-2 transition-colors border rounded-md  focus:outline-none focus:border-uos-purple peer ${focusError ? "border-red-600" : "border-uos-gray"}`}
            value={value}
            onChange={(e) => {
              if (type === "number") {
                onChange(validateNumber(e));
              } else {
                onChange(e.target.value);
              }
              setFocusError(false);
            }}
            placeholder={placeholder}
            onBlur={(e) => {
              if (required && value === "") {
                setFocusError(true);
              }
            }}
            type={type === "text" || type === "password" ? type : "text"}
          />
        ))}
    </div>
  );
};

export default TextInputBox;
