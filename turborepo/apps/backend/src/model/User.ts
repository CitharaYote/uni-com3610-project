import mongoose from "mongoose";
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  house: {
    type: String,
    required: false,
  },
  street: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  postcode: {
    type: String,
    required: false,
  },
});

const contactDetailsSchema = new Schema({
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
});

const savedResourcesSchema = new Schema({
  resourceLink: {
    type: String,
    required: true,
  },
  resourceTitle: {
    type: String,
    required: false,
  },
  resourceType: {
    type: String,
    required: true,
    enum: ["cv", "coverLetter", "other"],
  },
  resourceDescription: {
    type: String,
    required: false,
  },
  dateSaved: {
    type: Date,
    default: Date.now,
  },
});

const educationSchema = new Schema({
  institution: {
    type: String,
    required: false,
  },
  period: {
    type: {
      start: {
        type: Date,
        required: false,
      },
      end: {
        type: Date,
        required: false,
      },
    },
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  qualification: {
    type: String,
    required: false,
  },
  subject: {
    type: String,
    required: false,
  },
  grade: {
    type: String,
    required: false,
  },
});

const workExperienceSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  period: {
    type: {
      start: {
        type: Date,
        required: false,
      },
      end: {
        type: Date,
        required: false,
      },
    },
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  noticePeriod: {
    type: String,
    required: false,
  },
  jobTitle: {
    type: String,
    required: false,
  },
  salary: {
    type: Number,
    required: false,
  },
  reasonForLeaving: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});

const referencesSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  jobTitle: {
    type: String,
    required: false,
  },
  nameOfEmployer: {
    type: String,
    required: false,
  },
  relationship: {
    type: String,
    required: false,
  },
  contactDetails: {
    type: contactDetailsSchema,
    required: false,
  },
  canContact: {
    type: Boolean,
    required: false,
  },
});

const questionnaireAnswersSchema = new Schema({
  c_criminalConvictions: {
    type: {
      q_unspentConvictions: {
        type: Boolean,
        required: false,
      },
      q_spentConvictions: {
        type: Boolean,
        required: false,
      },
      q_additionalInformation: {
        type: String,
        required: false,
      },
    },
    required: false,
  },
  c_disability: {
    type: {
      q_disability: {
        type: Boolean,
        required: false,
      },
      q_additionalInformation: {
        type: String,
        required: false,
      },
    },
    required: false,
  },
  c_eligibilityToWork: {
    type: {
      q_eligibilityToWork: {
        type: Boolean,
        required: false,
      },
      q_additionalInformation: {
        type: String,
        required: false,
      },
      q_visaInformation: {
        type: Date,
        required: false,
      },
    },
    required: false,
  },
  c_references: {
    type: [referencesSchema],
    required: false,
  },
});

const profileSchema = new Schema({
  names: {
    type: {
      first: {
        type: String,
        required: false,
      },
      last: {
        type: String,
        required: false,
      },
      other: {
        type: String,
        required: false,
      },
    },
    required: false,
  },
  contactDetails: {
    type: contactDetailsSchema,
    required: false,
  },
  address: {
    type: addressSchema,
    required: false,
  },
  savedResources: {
    type: [savedResourcesSchema],
    required: true,
  },
  education: {
    type: [educationSchema],
    required: true,
  },
  workExperience: {
    type: [workExperienceSchema],
    required: true,
  },
  questionnaireAnswers: {
    type: questionnaireAnswersSchema,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const notificationSchema = new Schema({
  type: {
    type: String,
    required: true,
    // TODO: add enum
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  associatedJobId: {
    type: String,
    required: false,
  },
  associatedApplicationId: {
    type: String,
    required: false,
  },
  viewed: {
    type: Boolean,
    required: true,
  },
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number, // 1984
    Admin: Number, // 5150
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  profile: {
    type: profileSchema,
    required: false,
  },
  notifications: {
    type: [notificationSchema],
    required: false,
  },
});

export default mongoose.model("User", UserSchema);
