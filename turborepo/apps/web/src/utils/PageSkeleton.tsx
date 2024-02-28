/**
 * @file General page skeleton for the app
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// Package Imports

// Component Imports

// Asset Imports

export type PageSkeletonProps = {
  className?: string;
  children?: React.ReactNode;
};
/**
 * PageSkeleton renders a React component.
 * @param {string} className - The class name to apply to the component.
 * @param {React.ReactNode} children - The children to apply to the component.
 */
const PageSkeleton = (p: PageSkeletonProps) => {
  const [navbarActive, setNavbarActive] = useState(true);
  return (
    <div
      className={`${p.className} w-screen min-h-screen flex flex-col justify-between`}
      onClick={() => setNavbarActive(!navbarActive)}
    >
      <AnimatePresence>
        {navbarActive && <Navbar className="text-white bg-gray-800" />}
      </AnimatePresence>
      <div className="flex items-start justify-center w-full h-full">
        {p.children}
      </div>
      <Footer className="text-white bg-gray-800" />
    </div>
  );
};

export default PageSkeleton;
