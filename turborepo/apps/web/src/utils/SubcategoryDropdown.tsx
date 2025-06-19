/**
 * @file Displays subcategories with children for a page
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { useState } from "react";
import { Subcategory } from "./PageSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

// Package Imports

// Component Imports

// Asset Imports

export type SubcategoryDropdownProps = {
  className?: string;
  subcategory: Subcategory;
};

/**
 * SubcategoryDropdown renders a React component.
 * @param {string} className - The class name to apply to the component.
 * @param {Subcategory} subcategory - The subcategory to display.
 */
const SubcategoryDropdown = (p: SubcategoryDropdownProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div className="h-full ">
      <motion.button
        className={`${p.className} text-white relative h-full flex flex-row items-center justify-center mr-8`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsExpanded(!isExpanded)}
        //   href={p.subcategory.url}
      >
        <motion.span
          className="absolute top-0 h-0.5 bg-white"
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        />
        <motion.p className="flex flex-row items-center gap-2 text-lg">
          {p.subcategory.displayName}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-down"
            viewBox="0 0 16 16"
            animate={{ scaleY: isExpanded ? -1 : 1 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          >
            <path
              fillRule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
          </motion.svg>
        </motion.p>
      </motion.button>
      <motion.div
        className="absolute left-0 w-screen overflow-hidden bg-black bg-opacity-20 top-full"
        animate={{ height: isExpanded ? "100%" : "0%" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        onClick={() => setIsExpanded(false)}
      />
      <AnimatePresence>
        <motion.div
          className="absolute left-0 w-screen overflow-hidden top-full bg-uos-darkgray"
          animate={{ height: isExpanded ? "100%" : "0%" }}
          exit={{ height: "0%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        >
          <motion.div
            className="flex flex-row items-center justify-start w-full h-full max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
          >
            {p.subcategory.children?.map((subcategory) => (
              <Link
                className="relative flex flex-row items-center justify-center h-full mr-8 text-white hover:underline"
                to={subcategory.url}
              >
                <motion.p className="text-lg">
                  {subcategory.displayName}
                </motion.p>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default SubcategoryDropdown;
