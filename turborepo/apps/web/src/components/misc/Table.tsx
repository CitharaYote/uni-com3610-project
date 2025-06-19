/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

// Package Imports

// Component Imports

// Asset Imports

export type TableProps = {
  className?: string;
};

/**
 * Table renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const Table = (p: TableProps) => {
  return <div className={`${p.className}`}></div>;
};

export default Table;
