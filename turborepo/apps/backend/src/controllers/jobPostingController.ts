import Application from "../model/Application";
import JobPosting from "../model/JobPosting";
import User from "../model/User";

const getAllJobPostings = async (req: any, res: any) => {
  const jobPostings = await JobPosting.find();
  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });
  res.json(jobPostings);
};

const getAllJobPostingsPaginated = async (req: any, res: any) => {
  const { page = 1, limit = 10 } = req.query;
  const jobPostings = await JobPosting.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });
  res.json(jobPostings);
};

const getEndingSoonPostingsPaginated = async (req: any, res: any) => {
  const { page = 1, limit = 10 } = req.query;
  const jobPostings = await JobPosting.find({
    "dates.closingDate": { $gte: new Date() }, // Filter to include only closing dates greater than or equal to the current date
  })
    .sort({ "dates.closingDate": 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  res.json(jobPostings);
};

const getJustEndedPostingsPaginated = async (req: any, res: any) => {
  const { page = 1, limit = 10 } = req.query;
  const jobPostings = await JobPosting.find({
    "dates.closingDate": { $lt: new Date() }, // Filter to include only closing dates less than the current date
  })
    .sort({ "dates.closingDate": -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  res.json(jobPostings);
};

const getRecentPostingsPaginated = async (req: any, res: any) => {
  const { page = 1, limit = 10 } = req.query;
  const jobPostings = await JobPosting.find({
    "dates.listingDate": { $lte: new Date() }, // Filter to include only listing dates less than or equal to the current date
  })
    .sort({ "dates.listingDate": -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  res.json(jobPostings);
};

const getAllJobPostingsPublic = async (req: any, res: any) => {
  // return job postings without any of the backend fields
  // to be served to the public
  const jobPostings = await JobPosting.find();
  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  const publicPostings = jobPostings.map((posting) => {
    if (posting.visible)
      return {
        title: posting.title,
        description: posting.description,
        tags: posting.tags,
        location: posting.location,
        salary: posting.salary?.hidden
          ? null
          : {
              min: posting.salary?.min || null,
              max: posting.salary?.max || null,
            },
        dates: posting.dates?.hideClosingDate
          ? {
              listingDate: posting.dates?.listingDate,
            }
          : {
              listingDate: posting.dates?.listingDate,
              closingDate: posting.dates?.closingDate,
            },
      };
  });

  res.json(publicPostings);
};

const getEndingSoonPostingsPublicPaginated = async (req: any, res: any) => {
  const { page = 1, limit = 10 } = req.query;
  const jobPostings = await JobPosting.find({
    visible: true,
    "dates.hideClosingDate": false, // hides job postings that have hidden closing dates
    "dates.listingDate": { $lte: new Date() }, // hides job postings that have not yet been listed
    "dates.closingDate": { $gte: new Date() }, // hides job postings that have already closed
  })
    .sort({ "dates.closingDate": 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  const publicPostings = jobPostings.map((posting) => {
    if (posting.visible)
      return {
        _id: posting._id,
        reference: posting.reference || null,
        title: posting.title,
        description: posting.description,
        workingPattern: posting.workingPattern,
        jobType: posting.jobType,
        contractType: posting.contractType,
        faculty: posting.faculty || null,
        department: posting.department || null,
        tags: posting.tags,
        location: posting.location,
        salary: posting.salary.hidden
          ? null
          : {
              min: posting.salary.min || null,
              max: posting.salary.max || null,
              potentialMax: posting.salary.potentialMax || null,
              grade: posting.salary.grade || null,
              currency: posting.salary.currency,
              proRata: posting.salary.proRata,
            },
        dates: posting.dates?.hideClosingDate
          ? {
              listingDate: posting.dates?.listingDate,
            }
          : {
              listingDate: posting.dates?.listingDate,
              closingDate: posting.dates?.closingDate,
            },
      };
  });

  res.json(publicPostings);
};

const getRecentPostingsPublicPaginated = async (req: any, res: any) => {
  const { page = 1, limit = 10 } = req.query;
  const jobPostings = await JobPosting.find({
    visible: true,
    "dates.listingDate": { $lte: new Date() }, // hides job postings that have not yet been listed
    "dates.closingDate": { $gte: new Date() }, // hides job postings that have already closed
  })
    .sort({ "dates.listingDate": -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  const publicPostings = jobPostings.map((posting) => {
    if (posting.visible)
      return {
        _id: posting._id,
        reference: posting.reference || null,
        title: posting.title,
        description: posting.description,
        workingPattern: posting.workingPattern,
        jobType: posting.jobType,
        contractType: posting.contractType,
        faculty: posting.faculty || null,
        department: posting.department || null,
        tags: posting.tags,
        location: posting.location,
        salary: posting.salary.hidden
          ? null
          : {
              min: posting.salary.min || null,
              max: posting.salary.max || null,
              potentialMax: posting.salary.potentialMax || null,
              grade: posting.salary.grade || null,
              currency: posting.salary.currency,
              proRata: posting.salary.proRata,
            },
        dates: posting.dates.hideClosingDate
          ? {
              listingDate: posting.dates.listingDate,
            }
          : {
              listingDate: posting.dates.listingDate,
              closingDate: posting.dates.closingDate || null,
            },
      };
  });

  res.json(publicPostings);
};

const createNewJobPosting = async (req: any, res: any) => {
  // add a 2 second delay to simulate server response time
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (!req?.body?.title || !req?.body?.description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }
  if (!req?.user) {
    return res.status(401).json({ message: "Unauthorised" });
  }

  const defaultPosting = {
    reference: req.body.reference || null,
    title: req.body.title,
    description: req.body.description,
    workingPattern: req.body.workingPattern,
    jobType: req.body.jobType,
    contractType: req.body.contractType,
    faculty: req.body.faculty || null,
    department: req.body.department || null,
    tags: req.body.tags,
    location: req.body.location,
    salary: req.body.salary,
    dates: req.body.dates,
    ranking: req.body.ranking || null,
    visible: req.body.visible || false,
    postedBy: req.user,
    notifications: req.body.notifications || [],
    savedBy: req.body.savedBy || [],
    panelMembers: [req.user],
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await JobPosting.create(defaultPosting);

    res.status(201).json(result);
  } catch (err) {
    // catch validation errors
    console.error(err);
    res.status(400).json(err);
  }
};

const updateJobPosting = async (req: any, res: any) => {
  // takes an object with the complete job posting
  try {
    if (!req?.body?._id) {
      return res.status(400).json({ message: "ID parameter is required." });
    }

    const jobPosting = await JobPosting.findOne({ _id: req.body._id }).exec();
    if (!jobPosting) {
      return res
        .status(204)
        .json({ message: `No job posting matches ID ${req.body._id}.` });
    }

    const updatedPosting = req.body;
    const result = await jobPosting.updateOne(updatedPosting);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const deleteJobPosting = async (req: any, res: any) => {
  if (!req?.body?._id)
    return res.status(400).json({ message: "Job Posting ID required." });

  const jobPosting = await JobPosting.findOne({ _id: req.body._id }).exec();
  if (!jobPosting) {
    return res
      .status(204)
      .json({ message: `No job posting matches ID ${req.body._id}.` });
  }
  const result = await jobPosting.deleteOne();
  res.json(result);
};

const getJobPosting = async (req: any, res: any) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Job Posting ID required." });

  const jobPosting = await JobPosting.findOne({ _id: req.params.id }).exec();
  if (!jobPosting) {
    return res
      .status(204)
      .json({ message: `No job posting matches ID ${req.params.id}.` });
  }
  res.json(jobPosting);
};

const getJobPostingPublic = async (req: any, res: any) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Job Posting ID required." });

  console.log("getJobPostingPublic 1 - why tf is this being called");

  const jobPosting = await JobPosting.findOne({ _id: req.params.id }).exec();
  if (!jobPosting) {
    return res
      .status(204)
      .json({ message: `No job posting matches ID ${req.params.id}.` });
  }
  if (!jobPosting.visible) {
    return res
      .status(204)
      .json({ message: `Job posting ${req.params.id} is not visible.` });
  }
  if (jobPosting.dates.listingDate > new Date()) {
    return res.status(204).json({
      message: `Job posting ${req.params.id} is not yet listed.`,
    });
  }
  if (
    // if the closing date is more than 7 days in the past
    jobPosting.dates.closingDate &&
    jobPosting.dates.closingDate <
      new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  ) {
    return res.status(204).json({
      message: `Job posting ${req.params.id} has already closed.`,
    });
  }
  const publicPosting = {
    _id: jobPosting._id,
    reference: jobPosting.reference || null,
    title: jobPosting.title,
    description: jobPosting.description,
    workingPattern: jobPosting.workingPattern,
    jobType: jobPosting.jobType,
    contractType: jobPosting.contractType,
    faculty: jobPosting.faculty || null,
    department: jobPosting.department || null,
    tags: jobPosting.tags,
    location: jobPosting.location,
    salary: jobPosting.salary.hidden
      ? null
      : {
          min: jobPosting.salary.min || null,
          max: jobPosting.salary.max || null,
          potentialMax: jobPosting.salary.potentialMax || null,
          grade: jobPosting.salary.grade || null,
          currency: jobPosting.salary.currency,
          proRata: jobPosting.salary.proRata,
        },
    dates: jobPosting.dates.hideClosingDate
      ? {
          listingDate: jobPosting.dates.listingDate,
        }
      : {
          listingDate: jobPosting.dates.listingDate,
          closingDate: jobPosting.dates.closingDate || null,
        },
  };
  res.json(publicPosting);
};

const getSavedByUser = async (req: any, res: any) => {
  // return whether a specific job posting has been saved by the current user

  console.log("getSavedByUser 1");
  // console.log("req: ", req);
  console.log("req.user: ", req.user);
  console.log("req.body._id: ", req.body._id);

  if (!req?.user)
    return res.status(400).json({ message: "Username required." });
  if (!req?.body?._id)
    return res.status(400).json({ message: "Job Posting ID required." });

  console.log("getSavedByUser 2");

  const jobPosting = await JobPosting.findOne({ _id: req.body._id }).exec();

  if (!jobPosting)
    return res.status(204).json({ message: "No job posting found." });

  res.json(jobPosting.savedBy && jobPosting.savedBy.includes(req.user));
};

const getSavedAppliedByUser = async (req: any, res: any) => {
  // returns both whether the job posting has been saved by the user
  // and whether the user has applied to the job posting

  if (!req?.user)
    return res.status(400).json({ message: "Username required." });
  if (!req?.body?._id)
    return res.status(400).json({ message: "Job Posting ID required." });

  const jobPosting = await JobPosting.findOne({ _id: req.body._id }).exec();

  if (!jobPosting)
    return res.status(204).json({ message: "No job posting found." });

  const user = await User.findOne({ username: req.user }).exec();

  if (!user || !user._id)
    return res
      .status(204)
      .json({ message: "No user found with that username." });

  console.log("getSavedAppliedByUser 0");
  console.log("user: ", user._id.toString());

  const application = await Application.findOne({
    applicantId: user._id.toString(),
    jobPostingId: req.body._id,
  }).exec();

  console.log("getSavedAppliedByUser 1");
  console.log("jobPosting.savedBy: ", jobPosting.savedBy);
  console.log("req.user: ", req.user);
  console.log(
    "jobPosting.savedBy.includes(req.user): ",
    jobPosting.savedBy?.includes(req.user)
  );
  console.log("application: ", application);

  res.json({
    saved: jobPosting.savedBy && jobPosting.savedBy.includes(req.user),
    applied: application ? true : false,
  });
};

const getAllSavedByUser = async (req: any, res: any) => {
  // return all job postings saved by the current user (paginated)

  const { page = 1, limit = 10 } = req.body.search;

  if (!req?.user)
    return res.status(400).json({ message: "Username required." });

  const jobPostings = await JobPosting.find({
    savedBy: req.user,
  })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await JobPosting.find({ savedBy: req.user }).countDocuments();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  res.json({ jobPostings, count });
};

const saveListingToUser = async (req: any, res: any) => {
  // save the job posting to the user's saved listings
  // this will be used to show the user's saved listings
  // on the dashboard

  // console.log("saveListingToUser 1");
  // console.log("req: ", req);

  if (!req?.user)
    return res.status(400).json({ message: "Username required." });
  if (!req?.body?._id)
    return res.status(400).json({ message: "Job Posting ID required." });

  const jobPosting = await JobPosting.findOne({ _id: req.body._id }).exec();

  if (!jobPosting)
    return res.status(204).json({ message: "No job posting found." });

  // const result = await jobPosting.updateOne({
  //   $push: { savedBy: req.user },
  // });

  // if more than 5 people have saved it, add the 'Trending' tag if it doesn't already exist

  // console.log("saveListingToUser 2");

  let result;
  if (!jobPosting.savedBy) jobPosting.savedBy = [];

  if (jobPosting.savedBy.includes(req.user)) {
    console.log("removing user from savedBy");
    result = await jobPosting.updateOne({
      $pull: { savedBy: req.user },
    });
    if (jobPosting.savedBy.length - 1 <= 0) {
      console.log("removing trending tag");
      result = await jobPosting.updateOne({
        $pull: { tags: "Trending" },
      });
    }
  } else {
    console.log("adding user to savedBy");
    result = await jobPosting.updateOne({
      $push: { savedBy: req.user },
    });
    if (jobPosting.savedBy.length + 1 > 0) {
      console.log("adding trending tag");
      result = await jobPosting.updateOne({
        $push: { tags: "Trending" },
      });
    }
  }

  // if the savedBy array contains an object with the user's username, remove it
  // if not, add it
  // if the savedBy array is empty, (ie. hasn't been initialised) initialise it with the user's username

  // if (!jobPosting.savedBy) jobPosting.savedBy = [];

  // if (jobPosting.savedBy && jobPosting.savedBy.includes(req.user)) {
  //   result = await jobPosting.updateOne({
  //     $pull: { savedBy: req.user },
  //   });
  // } else {
  //   result = await jobPosting.updateOne({
  //     $push: { savedBy: req.user },
  //   });
  // }

  // console.log("saveListingToUser 3");

  res.json({
    data: result,
    action: jobPosting.savedBy.includes(req.user) ? "saved" : "unsaved",
  });
};

const getStaffListingsDashboard = async (req: any, res: any) => {
  // combine the first 10 ending soon, recently posted and just ended job postings
  // in a single api call

  if (!req?.user)
    return res.status(400).json({ message: "Username required." });

  const endingSoon = await JobPosting.find({
    "dates.closingDate": { $gte: new Date() }, // Filter to include only closing dates greater than or equal to the current date
  })
    .sort({ "dates.closingDate": 1 })
    .limit(10)
    .exec();

  const justEnded = await JobPosting.find({
    "dates.closingDate": { $lt: new Date() }, // Filter to include only closing dates less than the current date
  })
    .sort({ "dates.closingDate": -1 })
    .limit(10)
    .exec();

  const recentPostings = await JobPosting.find({
    "dates.listingDate": { $lte: new Date() }, // Filter to include only listing dates less than or equal to the current date
  })
    .sort({ "dates.listingDate": -1 })
    .limit(10)
    .exec();

  // const notifications = await JobPosting.find({
  //   "notifications.username": req.user,
  //   "notifications.viewed": false,
  //   "notifications.notificationDate": {
  //     $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  //   },
  // }).exec();

  const recentlyCreated = await JobPosting.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec();

  const staffListings = {
    endingSoon,
    justEnded,
    recentPostings,
    recentlyCreated,
  };

  if (!staffListings)
    return res.status(204).json({ message: "No job postings found." });

  res.json(staffListings);
};

const getUpdatedJobPostings = async (req: any, res: any) => {
  // get all postings with a notification for the user that's not been viewed
  // notifications are an array of objects with the following fields:
  // username, notificationDate, viewed, message

  if (!req?.user)
    return res.status(400).json({ message: "Username required." });

  const jobPostings = await JobPosting.find({
    "notifications.username": req.user,
    "notifications.viewed": false,
    "notifications.notificationDate": {
      $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  }).exec();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  res.json(jobPostings);
};

const getSearchOptions = async (req: any, res: any) => {
  // return all possible search options for the job postings that would normally be a string
  // eg. faculty, department
  console.log("getSearchOptions 1");

  const jobPostings = await JobPosting.find().exec();
  console.log("getSearchOptions 2");
  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  console.log("getSearchOptions 3");
  // const searchOptions = {
  //   faculty: jobPostings.map((posting) => {
  //     // if the
  //   }),
  //   department: jobPostings.map((posting) => {
  //     if (
  //       posting.department &&
  //       posting.department !== "" &&
  //       posting.department !== null
  //     )
  //       return posting.department;
  //   }),
  //   tags: jobPostings.map((posting) => {
  //     if (posting.tags && posting.tags.length > 0)
  //       return posting.tags.map((tag) => {
  //         if (tag && tag !== "" && tag !== null) return tag;
  //       });
  //   }),
  //   location: jobPostings.map((posting) => {
  //     if (
  //       posting.location.locationName &&
  //       posting.location.locationName !== "" &&
  //       posting.location.locationName !== null
  //     )
  //       return posting.location.locationName;
  //   }),
  // };
  // console.log("getSearchOptions 4");

  type searchOptionsType = {
    faculty: string[];
    department: string[];
    tags: string[];
    location: string[];
  };

  let searchOptions: searchOptionsType = {
    faculty: [],
    department: [],
    tags: [],
    location: [],
  };

  jobPostings.forEach((posting) => {
    if (
      posting.faculty &&
      posting.faculty !== "" &&
      posting.faculty !== null &&
      !searchOptions.faculty.includes(posting.faculty)
    )
      searchOptions.faculty.push(posting.faculty);

    if (
      posting.department &&
      posting.department !== "" &&
      posting.department !== null &&
      !searchOptions.department.includes(posting.department)
    )
      searchOptions.department.push(posting.department);

    if (posting.tags && posting.tags.length > 0) {
      posting.tags.forEach((tag) => {
        if (
          tag &&
          tag !== "" &&
          tag !== null &&
          !searchOptions.tags.includes(tag)
        )
          searchOptions.tags.push(tag);
      });
    }

    if (
      posting.location.locationName &&
      posting.location.locationName !== "" &&
      posting.location.locationName !== null &&
      !searchOptions.location.includes(posting.location.locationName)
    )
      searchOptions.location.push(posting.location.locationName);
  });

  res.json(searchOptions);
};

const searchFilterPostingsPaginated = async (req: any, res: any) => {
  /**
   * Takes a query object with the following fields:
   * search: {
   *  string: string,
   *  field: enum(tbd) | null, (if null, search all fields)
   * },
   * filters: {
   *  jobType: enum,
   *  contractType: enum,
   *  workingPattern: enum,
   *  faculty: string, (in practice will be an enum given by the search options)
   *  department: string, (in practice will be an enum given by the search options)
   *  location: string, (in practice will be an enum given by the search options)
   *  salary: {
   *   min: number,
   *   max: number,
   *  },
   *  tags: string[], (in practice will be an enum given by the search options)
   * }
   * sort: {
   *  field: enum, (field to sort by, can be any fields with a quantitative value)
   *  order: enum(asc, desc),
   * }
   * page: number,
   * limit: number,
   */

  const { search, filters, sort, page = 1, limit = 10 } = req.body.search;
  const { string } = search;
  const {
    jobType,
    contractType,
    workingPattern,
    faculty,
    department,
    location,
    salary,
    tags,
  } = filters;
  const { field: sortField, order } = sort;

  const query = {
    $and: [
      // { title: { $regex: string, $options: "i" } },
      // { description: { $regex: string, $options: "i" } },
      // { tags: { $in: tags } },
      // { location: { locationName: { $regex: location, $options: "i" } } },
      // { faculty: { $regex: faculty, $options: "i" } },
      // { department: { $regex: department, $options: "i" } },
      {
        $or: [
          string !== "" ? { title: { $regex: string, $options: "i" } } : {},
          string !== ""
            ? { description: { $regex: string, $options: "i" } }
            : {},
        ],
      },
      tags.length > 0 ? { tags: { $in: tags } } : {},
      location && location !== ""
        ? { "location.locationName": { $regex: location, $options: "i" } }
        : {},
      faculty && faculty !== ""
        ? { faculty: { $regex: faculty, $options: "i" } }
        : {},
      department && department !== ""
        ? { department: { $regex: department, $options: "i" } }
        : {},
      salary.min && salary.min !== -Infinity
        ? { "salary.min": { $gte: salary.min } }
        : {},
      salary.max && salary.max !== Infinity
        ? { "salary.max": { $lte: salary.max } }
        : {},
      jobType && jobType !== "" ? { jobType } : {},
      contractType && contractType !== "" ? { contractType } : {},
      workingPattern && workingPattern !== "" ? { workingPattern } : {},
    ],
  };

  const jobPostings = await JobPosting.find(query)
    .collation({ locale: "en", strength: 2 }) // Add this line to ignore case when sorting
    .sort({ [sortField]: order === "asc" ? 1 : -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  // res.json(jobPostings);

  const jobPostingsCount = await JobPosting.find(query).countDocuments().exec();
  res.json({ jobPostings, count: jobPostingsCount });
};

const searchFilterPublicPostingsPaginated = async (req: any, res: any) => {
  /**
   * Takes a query object with the following fields:
   * search: {
   *  string: string,
   *  field: enum(tbd) | null, (if null, search all fields)
   * },
   * filters: {
   *  jobType: enum,
   *  contractType: enum,
   *  workingPattern: enum,
   *  faculty: string, (in practice will be an enum given by the search options)
   *  department: string, (in practice will be an enum given by the search options)
   *  location: string, (in practice will be an enum given by the search options)
   *  salary: {
   *   min: number,
   *   max: number,
   *  },
   *  tags: string[], (in practice will be an enum given by the search options)
   * }
   * sort: {
   *  field: enum, (field to sort by, can be any fields with a quantitative value)
   *  order: enum(asc, desc),
   * }
   * page: number,
   * limit: number,
   */

  const { search, filters, sort, page = 1, limit = 10 } = req.body.search;
  const { string } = search;
  const {
    jobType,
    contractType,
    workingPattern,
    faculty,
    department,
    location,
    salary,
    tags,
  } = filters;
  const { field: sortField, order } = sort;

  const query = {
    visible: true,
    $and: [
      // { title: { $regex: string, $options: "i" } },
      // { description: { $regex: string, $options: "i" } },
      // { tags: { $in: tags } },
      // { location: { locationName: { $regex: location, $options: "i" } } },
      // { faculty: { $regex: faculty, $options: "i" } },
      // { department: { $regex: department, $options: "i" } },
      {
        $or: [
          string !== "" ? { title: { $regex: string, $options: "i" } } : {},
          string !== ""
            ? { description: { $regex: string, $options: "i" } }
            : {},
        ],
      },
      tags.length > 0 ? { tags: { $in: tags } } : {},
      location && location !== ""
        ? { "location.locationName": { $regex: location, $options: "i" } }
        : {},
      faculty && faculty !== ""
        ? { faculty: { $regex: faculty, $options: "i" } }
        : {},
      department && department !== ""
        ? { department: { $regex: department, $options: "i" } }
        : {},
      salary.min && salary.min !== -Infinity
        ? { "salary.min": { $gte: salary.min } }
        : {},
      salary.max && salary.max !== Infinity
        ? { "salary.max": { $lte: salary.max } }
        : {},
      jobType && jobType !== "" ? { jobType } : {},
      contractType && contractType !== "" ? { contractType } : {},
      workingPattern && workingPattern !== "" ? { workingPattern } : {},
    ],
  };

  const jobPostings = await JobPosting.find(query)
    .collation({ locale: "en", strength: 2 }) // Add this line to ignore case when sorting
    .sort({ [sortField]: order === "asc" ? 1 : -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (!jobPostings)
    return res.status(204).json({ message: "No job postings found." });

  const jobPostingsCount = await JobPosting.find(query).countDocuments().exec();

  const publicPostings = jobPostings.map((posting) => {
    if (posting.visible)
      return {
        _id: posting._id,
        reference: posting.reference || null,
        title: posting.title,
        description: posting.description,
        workingPattern: posting.workingPattern,
        jobType: posting.jobType,
        contractType: posting.contractType,
        faculty: posting.faculty || null,
        department: posting.department || null,
        tags: posting.tags,
        location: posting.location,
        salary: posting.salary.hidden
          ? null
          : {
              min: posting.salary.min || null,
              max: posting.salary.max || null,
              potentialMax: posting.salary.potentialMax || null,
              grade: posting.salary.grade || null,
              currency: posting.salary.currency,
              proRata: posting.salary.proRata,
            },
        dates: posting.dates.hideClosingDate
          ? {
              listingDate: posting.dates.listingDate,
            }
          : {
              listingDate: posting.dates.listingDate,
              closingDate: posting.dates.closingDate || null,
            },
      };
  });

  res.json({ jobPostings: publicPostings, count: jobPostingsCount });
};

const getApplicationNumberFromListing = async (req: any, res: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // return the number of applications for a specific job posting
  if (!req?.body?._id)
    return res.status(400).json({ message: "Job Posting ID required." });

  const jobPosting = await JobPosting.findOne({ _id: req.body._id }).exec();
  if (!jobPosting)
    return res.status(204).json({ message: "No job posting found." });

  const applications = await Application.find({
    jobPostingId: req.body._id,
  }).exec();

  res.json(applications.length);
};

const getApplicationsFromListing = async (req: any, res: any) => {
  // returns all applications for a specific job posting
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!req?.body?._id)
    return res.status(400).json({ message: "Job Posting ID required." });

  const jobPosting = await JobPosting.findOne({ _id: req.body._id }).exec();
  if (!jobPosting)
    return res.status(204).json({ message: "No job posting found." });

  const applications = await Application.find({
    jobPostingId: req.body._id,
  }).exec();

  res.json(applications);
};

const updateApplicationStatus = async (req: any, res: any) => {
  // update the status of an application
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!req?.body?._id)
    return res.status(400).json({ message: "Application ID required." });

  const application = await Application.findOne({ _id: req.body._id }).exec();
  if (!application)
    return res.status(400).json({ message: "No application found." });

  const result = await application.updateOne({ statusInt: req.body.statusInt });

  // add a notification to the user who submitted the application
  const user = await User.findOne({ _id: application.applicantId }).exec();
  if (!user)
    return res.status(400).json({ message: "No user found with that ID." });

  const listing = await JobPosting.findOne({
    _id: application.jobPostingId,
  }).exec();

  if (!listing)
    return res
      .status(400)
      .json({ message: "No job posting found with that ID." });

  const notification = {
    type: "application",
    date: new Date(),
    viewed: false,
    message: `Your application for the job posting '${listing.title}' has been updated.`,
    associatedApplicationId: application._id,
  };

  const userResult = await user.updateOne({
    $push: { notifications: notification },
  });

  res.json({ result, userResult });
};

const addUserToPanel = async (req: any, res: any) => {
  // takes a username and job posting ID and adds the user to the panel members
  // only allow if the user is the creator of the job posting
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("addUserToPanel 1");

  if (!req?.body?._id)
    return res.status(400).json({ message: "Job Posting ID required." });
  if (!req?.body?.username)
    return res.status(400).json({ message: "Username required." });

  console.log("addUserToPanel 1.5");

  const jobPosting = await JobPosting.findOne({ _id: req.body._id })
    .populate("postedBy")
    .exec();

  if (!jobPosting)
    return res.status(400).json({ message: "No job posting found." });

  console.log("addUserToPanel 1.6");

  if (jobPosting.postedBy !== req.user)
    return res.status(401).json({ message: "Unauthorised." });

  console.log("addUserToPanel 1.75");

  const user = await User.findOne({
    username: req.body.username,
  }).exec();

  if (!user)
    return res
      .status(400)
      .json({ message: "No user found with that username." });

  console.log("addUserToPanel 1.8");

  // const result = await jobPosting.updateOne({
  //   $push: { panelMembers: user },
  // });

  if (jobPosting.panelMembers.includes(user.username))
    return res.status(400).json({ message: "User already on panel." });

  console.log("addUserToPanel 2");

  try {
    const result = await jobPosting.updateOne({
      $push: { panelMembers: user.username },
    });
    res.status(201).json(result);
    console.log("addUserToPanel 3");
  } catch (err) {
    // catch validation errors
    console.error(err);
    res.status(400).json(err);
    console.log("addUserToPanel 4");
  }
};

const getPanelMembers = async (req: any, res: any) => {
  // return all panel members for a specific job posting
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!req?.body?._id)
    return res.status(400).json({ message: "Job Posting ID required." });

  const jobPosting = await JobPosting.findOne({ _id: req.body._id }).exec();
  if (!jobPosting)
    return res.status(204).json({ message: "No job posting found." });

  res.json(jobPosting.panelMembers);
};

const setRanking = async (req: any, res: any) => {
  // set the ranking for an application to 0,1 or 2
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!req?.body?.applicationId)
    return res.status(400).json({ message: "Application ID required." });

  if (!req?.body?.ranking)
    return res.status(400).json({ message: "Ranking required." });

  if (!req?.body?.jobPostingId)
    return res.status(400).json({ message: "Job Posting ID required." });

  const jobPosting = await JobPosting.findOne({
    _id: req.body.jobPostingId,
  }).exec();

  if (!jobPosting)
    return res.status(400).json({ message: "No job posting found." });

  if (!jobPosting.panelMembers.includes(req.user))
    return res.status(401).json({ message: "Unauthorised. heh" });

  if (jobPosting.ranking.length === 0) {
    jobPosting.ranking.push({
      applicationId: req.body.applicationId,
      staffRanks: {
        ...req.body.ranking,
        staffMemberUsername: req.user,
      },
    });
  } else {
    const index = jobPosting.ranking.findIndex(
      (rank) => rank.applicationId === req.body.applicationId
    );
    if (index === -1 || index === undefined) {
      jobPosting.ranking.push({
        applicationId: req.body.applicationId,
        staffRanks: {
          ...req.body.ranking,
          staffMemberUsername: req.user,
        },
      });
    } else {
      console.log("jobPosting.ranking[index]: ", jobPosting.ranking[index]);

      // jobPosting.ranking[index]!.staffRanks = {
      //   ...req.body.ranking,
      //   staffMemberUsername: req.user,
      // };
      jobPosting.ranking[index]!.staffRanks.push({
        ...req.body.ranking,
        staffMemberUsername: req.user,
      });
    }
  }

  console.log("jobPosting.ranking: ", jobPosting.ranking);

  // update job posting with new ranking
  const result = await jobPosting.updateOne({ ranking: jobPosting.ranking });

  // const user = await User.findOne({ username: req.user }).exec();
  // if (!user)
  //   return res.status(204).json({ message: "No user found with that username." });

  // // add a notification to the user who submitted the application
  // await User.updateOne(
  //   { username: user.username },
  //   {
  //     $push: {
  //       notifications: {
  //         type: "ranking",
  //         date: new Date(),
  //         viewed: false,
  //         message: `Your application for the job posting '${jobPosting.title}' has been ranked.`,
  //         associatedApplicationId: req.body.applicationId,
  //       },
  //     },
  //   }
  // );

  res.json(result);
};

const getAppliedListings = async (req: any, res: any) => {
  // get all listings a user has made an application to
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { page = 1, limit = 10 } = req.body.search;

  if (!req?.user)
    return res.status(400).json({ message: "Username required." });

  const user = await User.findOne({ username: req.user }).exec();
  if (!user)
    return res
      .status(204)
      .json({ message: "No user found with that username." });

  const applications = await Application.find({
    applicantId: user._id.toString(),
  }).exec();

  if (!applications)
    return res.status(204).json({ message: "No applications found." });

  const jobPostings = await JobPosting.find({
    _id: { $in: applications.map((app) => app.jobPostingId) },
  })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await JobPosting.find({
    _id: { $in: applications.map((app) => app.jobPostingId) },
  }).countDocuments();

  res.json({ jobPostings, count });
};

export {
  getAllJobPostings,
  getAllJobPostingsPaginated,
  getAllJobPostingsPublic,
  createNewJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getJobPosting,
  getJobPostingPublic,
  getEndingSoonPostingsPaginated,
  getEndingSoonPostingsPublicPaginated,
  getRecentPostingsPublicPaginated,
  getJustEndedPostingsPaginated,
  getRecentPostingsPaginated,
  getStaffListingsDashboard,
  getUpdatedJobPostings,
  getSearchOptions,
  searchFilterPublicPostingsPaginated,
  saveListingToUser,
  getSavedByUser,
  getSavedAppliedByUser,
  getAllSavedByUser,
  searchFilterPostingsPaginated,
  getApplicationNumberFromListing,
  getApplicationsFromListing,
  updateApplicationStatus,
  addUserToPanel,
  getPanelMembers,
  setRanking,
  getAppliedListings,
};
