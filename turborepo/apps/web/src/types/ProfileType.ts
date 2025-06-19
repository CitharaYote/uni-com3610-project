type ProfileType = {
  _id?: string;
  names: {
    first: string;
    last: string;
    other: string | null;
  };
  contactDetails: {
    email: string;
    phone: string;
  };
  address: {
    house: string;
    street: string;
    city: string;
    country: string;
    postcode: string;
  };
  savedResources: {
    resourceLink: string;
    resourceTitle: string | null;
    resourceType: "cv" | "coverLetter" | "other";
    resourceDescription: string | null;
    dateSaved: Date;
  }[];
  education: {
    institution: string | null;
    period: {
      start: Date | null;
      end: Date | null;
    };
    country: string | null;
    qualification: string | null;
    subject: string | null;
    grade: string | null;
  }[];
  workExperience: {
    company: string | null;
    period: {
      start: Date | null;
      end: Date | null;
    };
    country: string | null;
    noticePeriod: string | null;
    jobTitle: string | null;
    salary: number | null;
    reasonForLeaving: string | null;
    description: string | null;
  }[];
  questionnaireAnswers: {
    c_criminalConvictions: {
      q_unspentConvictions: boolean | null;
      q_spentConvictions: boolean | null;
      q_additionalInformation: string | null;
    };
    c_disability: {
      q_disability: boolean | null;
      q_additionalInformation: string | null;
    };
    c_eligibilityToWork: {
      q_eligibilityToWork: boolean | null;
      q_additionalInformation: string | null;
      q_visaInformation: Date | null;
    };
    c_references: {
      name: string | null;
      jobTitle: string | null;
      nameOfEmployer: string | null;
      relationship: string | null;
      contactDetails: {
        email: string | null;
        phone: string | null;
      } | null;
      canContact: boolean | null;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
};

export default ProfileType;
