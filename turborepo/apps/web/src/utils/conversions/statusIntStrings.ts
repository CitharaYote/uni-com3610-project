const statusIntStrings: { [key: number]: string } = {
  // status codes are displayed minimally to applicants
  // but are more detailed for employers
  0: "Submitted", // submitted by applicant
  1: "Reviewed", // marked as reviewed by at least one staff member
  2: "Interviewing", // currently in interview process
  3: "Shortlisted", // shortlisted for further consideration
  4: "Offered", // offered the position
  5: "Accepted", // accepted the position
  6: "Declined", // declined the position
  7: "Withdrawn", // withdrawn from the process
  8: "Rescinded", // offer rescinded by employer
  9: "Expired", // offer expired
  10: "Action Needed", // user needs to take action
};

const statusIntStringsPublic: { [key: number]: string } = {
  // some status codes are hidden to applicants
  0: "Submitted", // submitted by applicant
  1: "Under Review", // viewed by at least one staff member
  2: "Under Review", // currently in interview process
  3: "Under Review", // shortlisted for further consideration
  4: "Offered", // offered the position
  5: "Accepted", // accepted the position
  6: "Declined", // declined the position
  7: "Withdrawn", // withdrawn from the process
  8: "Rescinded", // offer rescinded by employer
  9: "Expired", // offer expired
  10: "Action Needed", // user needs to take action
};

export default statusIntStrings;
