import mongoose from "mongoose";
import Application from "./Application";
import Employee from "./Employee";
const Schema = mongoose.Schema;

const salarySchema = new Schema({
  min: {
    type: Number,
    required: false,
  },
  max: {
    type: Number,
    required: false,
  },
  potentialMax: {
    type: Number,
    required: false,
  },
  grade: {
    type: String,
    required: false,
  },
  currency: {
    type: String,
    required: true,
  },
  proRata: {
    type: Boolean,
    required: true,
  },
  hidden: {
    type: Boolean,
    required: true,
  },
});

const dateSchema = new Schema({
  listingDate: {
    type: Date,
    required: true,
  },
  closingDate: {
    type: Date,
    required: true,
  },
  hideClosingDate: {
    type: Boolean,
    required: true,
  },
});

const staffRankingSchema = new Schema({
  staffMemberUsername: {
    type: String,
    required: true,
  },
  ranking: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
    required: false,
  },
});

const rankingSchema = new Schema({
  applicationId: {
    type: String,
    required: true,
  },
  staffRanks: {
    type: [staffRankingSchema],
    required: true,
  },
});

const locationSchema = new Schema({
  remote: {
    type: String,
    required: true,
    enum: ["remote", "on-site", "hybrid", "other"],
  },
  locationName: {
    type: String,
    required: false,
  },
  linkedLocationId: {
    type: String,
    required: false,
  },
});

const notificationSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  notificationDate: {
    type: Date,
    required: true,
  },
  viewed: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const savedBySchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const JobPostingSchema = new Schema({
  reference: {
    // included for migration purposes
    // but might not be needed
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  workingPattern: {
    type: String,
    required: false,
    enum: [
      "full-time",
      "part-time",
      "flexible",
      "contract",
      "temporary",
      "internship",
      "apprenticeship",
      "volunteer",
      "other",
    ],
  },
  jobType: {
    type: String,
    required: true,
    enum: [
      "academic",
      "clerical",
      "clinical",
      "facilities",
      "management",
      "research",
      "teaching",
      "technical",
      "other",
    ],
  },
  contractType: {
    type: String,
    required: true,
    enum: ["permanent", "fixed-term", "open-ended", "other"],
  },
  faculty: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  salary: {
    type: salarySchema,
    required: true,
  },
  dates: {
    type: dateSchema,
    required: true,
  },
  ranking: {
    type: [rankingSchema],
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  // postedBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Staff",
  //   required: true,
  // },
  postedBy: {
    type: String,
    required: true,
  },
  notifications: {
    type: [notificationSchema],
    required: true,
  },
  savedBy: {
    type: [String],
    required: true,
  },
  panelMembers: {
    type: [String],
    required: true,
  },
  archived: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("JobPosting", JobPostingSchema);
