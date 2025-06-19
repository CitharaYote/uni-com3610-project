import ProfileType from "./ProfileType";

type ApplicationType = {
  _id: string;
  applicantId: string;
  listingId: string;
  profile: ProfileType;
  textContent: string | null;
  statusInt: number;
  statusInfo: string | null;
  archived: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  deleteBy: Date;
  flags: string;
};

export default ApplicationType;
