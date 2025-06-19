/**
 * @file This is an example of something that would go here.
 * @author Theo Cruddace
 * @copyright Theo Cruddace (c) All rights reserved.
 */

import PageSkeleton from "../utils/PageSkeleton";

// Package Imports

// Component Imports

// Asset Imports

/**
 * Unauthorised renders a React page.
 */
const Unauthorised = () => {
  return (
    <PageSkeleton heading="Unauthorised">
      <div className="mt-8 gap-y-4">
        <h1>Error 401: Unauthorised</h1>
        <p>
          You are not authorised to view this page. Please log in or register to
          continue.
        </p>
      </div>
    </PageSkeleton>
  );
};

export default Unauthorised;
