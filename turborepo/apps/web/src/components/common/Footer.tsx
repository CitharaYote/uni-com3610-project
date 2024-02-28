/**
 * @file Footer for the app
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

// Package Imports

// Component Imports

// Asset Imports

export type TM_FILENAME_BASEProps = {
  className?: string;
};

/**
 * Footer renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const Footer = (p: TM_FILENAME_BASEProps) => {
  return (
    <div className={`${p.className}`}>
      <p>Footer</p>
    </div>
  );
};

export default Footer;
