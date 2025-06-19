/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Scrollbar } from "react-scrollbars-custom";

// Package Imports

// Component Imports

// Asset Imports

export type ModalProps = {
  className?: string;
  onClick?: () => void;
  modalTitle?: string;
  children?: React.ReactNode;
  childWrapperClassname?: string;
};

/**
 * Modal renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const Modal = ({
  className,
  onClick,
  modalTitle = "Missing Modal Title!",
  children,
  childWrapperClassname,
}: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <motion.div
      className={`${className} w-screen h-screen bg-black fixed top-0 left-0 bg-opacity-30 z-40 backdrop-blur-sm py-16`}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="z-50 flex flex-col items-center justify-between h-full max-w-4xl px-8 py-6 mx-auto bg-white shadow-lg rounded-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row items-center justify-between w-full mx-4 my-2">
            <h1 className="text-2xl text-center text-uos-darkgray">
              {modalTitle}
            </h1>
            <button
              className="text-lg text-center transition text-uos-gray hover:text-uos-darkgray"
              onClick={onClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>
          </div>
          <hr className="w-full mt-2 mb-4" />
        </div>
        <div
          className={`w-full h-full ${childWrapperClassname} overflow-y-auto px-2 relative`}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
