import Application from "../model/Application";
import User from "../model/User";

const handleNewApplication = async (req: any, res: any) => {
  const application = req.body;
  if (!application)
    return res.status(400).json({ message: "No application provided." });

  const user = await User.findOne({ username: req.user }).exec();

  if (!user)
    return res.status(400).json({ message: "User not found in the database." });

  console.log("new application wooo");
  console.log("user id: ", user._id);
  console.log("user id 2: ", user._id.toString());

  // check for duplicate applications in the db
  // where the user has already applied to the same listing
  const duplicate = await Application.findOne({
    applicantId: user._id.toString(),
    jobPostingId: application.jobPostingId,
  }).exec();
  if (duplicate)
    return res.status(400).json({
      message: "You've already submitted an application for this job.",
    });

  try {
    //create and store the new application
    // set createdAt and updatedAt to the current date
    // console.log(
    //   "application",
    //   application.profile.questionnaireAnswers.c_references
    // );
    const newApplication = new Application({
      ...application,
      applicantId: user._id.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deleteBy: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    });

    await newApplication.save();

    res.status(201).json({ success: `New application created!` });
  } catch (e) {
    if (typeof e === "string") {
      return res.status(400).json({ message: e });
    } else if (e instanceof Error) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }
};

const getApplicationsFromListing = async (req: any, res: any) => {
  // take the listing id from the body
  const { listingId, page, limit } = req.body;

  // check for the required fields
  if (!listingId || !page || !limit)
    return res
      .status(400)
      .json({ message: "Listing ID, page and limit are required." });

  // get the applications from the listing
  const applications = await Application.find({ listingId })
    .skip(page * limit)
    .limit(limit)
    .exec();

  // return the applications
  res.status(200).json(applications);
};

const getApplicationsFromUser = async (req: any, res: any) => {
  // take the user id from the body
  const { userId, page, limit } = req.body;

  // check for the required fields
  if (!userId || !page || !limit)
    return res
      .status(400)
      .json({ message: "User ID, page and limit are required." });

  // get the applications from the user
  const applications = await Application.find({ userId })
    .skip(page * limit)
    .limit(limit)
    .exec();

  // return the applications
  res.status(200).json(applications);
};

const getApplicationFromListing = async (req: any, res: any) => {
  // take the listing id from the body
  const { listingId } = req.body;
  const username = req.user;

  // check for the required fields
  if (!listingId)
    return res.status(400).json({ message: "Listing ID is required." });

  if (!username)
    return res.status(400).json({ message: "Username is required" });

  const user = await User.findOne({ username }).exec();

  if (!user)
    return res.status(400).json({ message: "User not found in the database." });

  // get the application from the listing
  const application = await Application.findOne({
    applicantId: user._id.toString(),
    jobPostingId: listingId,
  }).exec();

  if (!application)
    return res.status(400).json({ message: "Application not found." });

  // return the application
  res.status(200).json(application);
};

export {
  handleNewApplication,
  getApplicationsFromListing,
  getApplicationsFromUser,
  getApplicationFromListing,
};
