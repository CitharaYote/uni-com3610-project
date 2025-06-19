import User from "../model/User";

const getAllUsers = async (req: any, res: any) => {
  console.log("getAllUsers");

  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

const deleteUser = async (req: any, res: any) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUser = async (req: any, res: any) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(user);
};

const updateUser = async (req: any, res: any) => {
  console.log("updateUser");

  if (!req?.body?._id)
    return res.status(400).json({ message: "User ID required" });
  console.log("updateUser 2");

  const user = await User.findOne({ _id: req.body._id }).exec();
  console.log("updateUser 3");
  if (!user)
    return res
      .status(204)
      .json({ message: `User ID ${req.body._id} not found` });

  console.log("updateUser 4");

  if (req.body?.username) user.username = req.body.username;
  if (req.body?.roles) user.roles = req.body.roles;
  user.updatedAt = new Date();
  const result = await user.save();
  console.log("updateUser result");

  res.json(result);
};

const getMe = async (req: any, res: any) => {
  console.log("getMe");

  // set timeout to simulate slow network
  await new Promise((resolve) => setTimeout(resolve, 750));

  const user = await User.findOne({ username: req.user }).exec();
  if (!user) return res.status(204).json({ message: "User not found" });

  // if no profile found, return empty object
  if (!user.profile) {
    res.json({});
  } else {
    res.json(user.profile);
  }
};

const updateMe = async (req: any, res: any) => {
  console.log("updateMe");

  const user = await User.findOne({ username: req.user }).exec();
  if (!user) return res.status(204).json({ message: "User not found" });

  if (req.body?.profile && user.profile) {
    user.profile = req.body.profile;
  } else if (req.body?.profile && !user.profile) {
    user.profile = req.body.profile;
  } else {
    return res.status(400).json({ message: "Profile data required" });
  }
  user.updatedAt = new Date();
  user.profile && (user.profile.updatedAt = new Date());
  const result = await user.save();
  res.json(result);
};

const addResourceToMe = async (req: any, res: any) => {
  console.log("addResourceToMe");

  const user = await User.findOne({ username: req.user }).exec();
  if (!user) return res.status(204).json({ message: "User not found" });

  if (req.body?.resource) {
    user.profile?.savedResources.push(req.body.resource);
  } else {
    return res.status(400).json({ message: "Resource data required" });
  }
  user.updatedAt = new Date();
  const result = await user.save();
  res.json(result);
};

const getNotifications = async (req: any, res: any) => {
  console.log("getNotifications");

  const user = await User.findOne({ username: req.user }).exec();
  if (!user) return res.status(204).json({ message: "User not found" });

  if (!user.notifications) return res.json([]);

  res.json(user.notifications);
};

export {
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
  getMe,
  updateMe,
  addResourceToMe,
  getNotifications,
};
