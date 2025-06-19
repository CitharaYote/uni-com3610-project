/**
 * @file Displays a single subcategory link for a page
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { motion } from "framer-motion";
import { useState } from "react";
import { Subcategory } from "./PageSkeleton";

// Package Imports

// Component Imports

// Asset Imports

export type SubcategoryLinkProps = {
  className?: string;
  subcategory: Subcategory;
};

/**
 * SubcategoryLink renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const SubcategoryLink = (p: SubcategoryLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  console.log(isHovered);

  return (
    <motion.a
      className={`${p.className} text-white relative h-full flex flex-row items-center justify-center hover:underline mr-8`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      href={p.subcategory.url}
    >
      <motion.span
        className="absolute top-0 h-0.5 bg-white"
        animate={{ width: isHovered ? "100%" : "0%" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
      />
      <motion.p className="text-lg">{p.subcategory.displayName}</motion.p>
    </motion.a>
  );
};

export default SubcategoryLink;
