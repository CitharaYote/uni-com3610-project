/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useEffect, useState } from "react";

// Package Imports

// Component Imports

// Asset Imports

export type ErrorDisplayProps = {
  className?: string;
  errorTitle?: string;
  errorMessage?: string;
  timeout?: number;
};

type ErrorType = {
  title: string;
  message: string;
} | null;

const ErrorContext = createContext<ErrorType>(null);

export const useError = () => useContext(ErrorContext);
/**
 * ErrorDisplay renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
export const ErrorDisplay = () => {
  // create a react component that'll display an error message
  // for a set amount of time before disappearing
  // it should have a title and a message
  const { error, clearError } = useError();

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    if (error) {
      timeout = setTimeout(clearError, 5000); // Clear error after 5 seconds
    }
    return () => clearTimeout(timeout);
  }, [error, clearError]);

  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.div
          className={`bg-red-100 border border-red-600 rounded-xl p-4 fixed top-8 left-8 flex flex-col items-start justify-center z-[100] max-w-72`}
          initial={{
            opacity: 0,
            y: -10,
            scale: 0.9,
            x: -40,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.9,
            x: -40,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 15,
          }}
          key={error.message}
        >
          <h1 className="text-lg font-normal text-red-600">{error.title}</h1>
          <p className="text-base font-light text-uos-gray">{error.message}</p>
          <motion.button
            className="absolute p-1 text-white transition-transform bg-red-600 rounded-full -right-2 -top-2 hover:scale-105"
            onClick={clearError}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const clearError = () => {
    setError(null);
  };

  const showError = ({ title, message }) => {
    setError({ title, message });
  };

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
      <ErrorDisplay />
    </ErrorContext.Provider>
  );
};
