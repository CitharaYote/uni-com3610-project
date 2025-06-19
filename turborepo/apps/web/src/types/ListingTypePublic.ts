type ListingTypePublic = {
  _id: string;
  reference: string | undefined;
  title: string;
  description: string;
  workingPattern:
    | "full-time"
    | "part-time"
    | "flexible"
    | "contract"
    | "temporary"
    | "internship"
    | "apprenticeship"
    | "volunteer"
    | "other"
    | "";
  jobType:
    | "academic" // Academic
    | "clerical" // Clerical & Secretarial
    | "clinical" // Clinical & Health
    | "facilities" // Facilities Support
    | "management" // Management, Administrative & Professional
    | "research" // Research
    | "teaching" // Teaching
    | "technical" // Technical
    | "other"
    | "";
  contractType: "permanent" | "fixed-term" | "open-ended" | "other" | "";
  faculty: string | undefined;
  department: string | undefined;
  tags: string[];
  location: {
    remote: "remote" | "on-site" | "hybrid" | "other" | "";
    locationName: string | undefined;
    linkedLocationId: string | undefined;
  };
  salary:
    | {
        min: number | undefined;
        max: number | undefined;
        potentialMax: number | undefined;
        grade: string | undefined;
        currency: string;
        proRata: boolean;
      }
    | undefined;
  dates: {
    listingDate: string;
    closingDate: string | undefined;
  };
};

export default ListingTypePublic;
