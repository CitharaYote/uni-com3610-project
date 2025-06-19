/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

// Package Imports

// Component Imports

// Asset Imports

export type DataPointProps = {
  className?: string;
  title: string;
  content: string;
  titleClassname?: string;
  contentClassname?: string;
  onClick?: () => void;
  autoSize?: boolean;
};

/**
 * DataPoint renders a React component.
 * @param {string} className - The class name to apply to the component.
 */
const DataPoint = ({
  className,
  title,
  content,
  titleClassname,
  contentClassname,
  onClick,
  autoSize,
}: DataPointProps) => {
  return (
    <div
      className={`flex flex-col bg-gray-50 hover:shadow border transition px-2 py-1 rounded-lg ${className} ${onClick ? "cursor-pointer" : ""}`}
    >
      <h2
        className={`text-lg text-uos-darkgray cursor-default ${titleClassname}`}
      >
        {title}
      </h2>
      <p
        className={`text-lg font-light text-uos-gray whitespace-nowrap cursor-default ${contentClassname}`}
      >
        {content}
      </p>
    </div>
  );
};

export default DataPoint;
