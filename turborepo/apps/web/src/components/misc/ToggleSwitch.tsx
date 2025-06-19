/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import { motion } from "framer-motion";

// Package Imports

// Component Imports

// Asset Imports

export type ToggleSwitchProps = {
  className?: string;
  // pass state and setstate
  state: boolean;
  setState: (state: boolean) => void;
};

/**
 * ToggleSwitch renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const ToggleSwitch = ({ className, state, setState }: ToggleSwitchProps) => {
  return (
    <button
      className={`${className} `}
      onClick={() => {
        setState(!state);
      }}
    >
      <div
        className={`${
          state
            ? "bg-uos-purple hover:bg-uos-purple-hover"
            : "bg-gray-400 hover:bg-gray-300"
        } w-12 h-6 rounded-full flex items-center p-1 relative transition-colors hover:drop-shadow-sm`}
      >
        <motion.div
          className={`${
            state ? "bg-white" : "bg-white"
          } w-4 h-4 rounded-full absolute transition-colors`}
          initial={{ x: state ? 24 : 0 }}
          animate={{ x: state ? 24 : 0 }}
          transition={{ duration: 0.25, type: "spring" }}
        />
      </div>
    </button>
  );
};

export default ToggleSwitch;
