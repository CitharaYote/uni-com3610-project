/**
 * @file Main navbar for the app
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

// Package Imports
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// Component Imports

// Asset Imports

export type NavbarProps = {
  className?: string;
};
/**
 * Navbar renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const Navbar = (p: NavbarProps) => {
  //   const [active, setActive] = useState(false);

  return (
    // <AnimatePresence>
    //   {active && (
    <motion.nav
      className={p.className}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
    >
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </motion.nav>
    //   )}
    // </AnimatePresence>
  );
};

export default Navbar;
