/**
 * @file General page skeleton for the app
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SubcategoryDisplay from "./SubcategoryDisplay";
import Sitemap from "../pages/Sitemap";
import { ErrorDisplay } from "../components/common/ErrorDisplay";

// Package Imports

// Component Imports

// Asset Imports

export type Subcategory = {
  key: string;
  displayName: string;
  url: string;
  requiredRoles?: number[];
  inverted?: boolean; // if true, the requiredRoles are roles that should not have access
  children?: Subcategory[]; // don't add children to existing children
};

export type PageSkeletonProps = {
  className?: string;
  title?: string;
  heading?: string;
  children?: React.ReactNode;
};
/**
 * PageSkeleton renders a React component.
 * @param {string} className - The class name to apply to the component.
 * @param {React.ReactNode} children - The children to apply to the component.
 * @param {string} heading - The heading to apply to the component. Can be overwritten via a state.
 */
const PageSkeleton = ({
  className,
  title,
  heading,
  children,
}: PageSkeletonProps) => {
  // TODO: update title placeholder
  document.title = title
    ? title + " | COM3610 App"
    : "Missing Title! | COM3610 App";

  const [navbarActive, setNavbarActive] = useState(true);
  const [headingText, setHeadingText] = useState(
    heading || "Missing Header Text!"
  );

  // fixes markdown dark mode for now
  document.documentElement.setAttribute("data-color-mode", "light");

  return (
    <div
      className={`${className} w-full min-h-screen flex flex-col justify-between z-20`}
      //   onClick={() => setNavbarActive(!navbarActive)}
    >
      <motion.div
        className="z-20 flex flex-col justify-start w-full bg-gray-800"
        // animate={{ height: navbarActive ? 16 : 64 }}
        // transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
      >
        <AnimatePresence>
          {navbarActive && <Navbar className="z-30 text-white bg-gray-800" />}
        </AnimatePresence>
        <motion.h1 className="w-full h-[72px] bg-uos-purple flex flex-row items-center justify-center flex-shrink-0 z-20">
          <div className="w-full max-w-6xl text-3xl font-extrabold text-white">
            {headingText}
          </div>
        </motion.h1>
        {Sitemap && <SubcategoryDisplay subcategories={Sitemap} />}
      </motion.div>
      <div className="flex items-start justify-center flex-grow w-full h-full pb-16 bg-uos-lightergray">
        {children}
      </div>
      {/* <Footer className="text-white bg-gray-800" /> */}
    </div>
  );
};

export default PageSkeleton;
