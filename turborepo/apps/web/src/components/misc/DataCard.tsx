/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

// Package Imports

// Component Imports

// Asset Imports

export type DataCardProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

/**
 * DataCard renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const DataCard = ({ className, children, onClick }: DataCardProps) => {
  return (
    <div
      className={`${className} bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow`}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      {children}
    </div>
  );
};

export default DataCard;
