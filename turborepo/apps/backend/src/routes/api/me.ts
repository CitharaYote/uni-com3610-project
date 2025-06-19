import express from "express";
const router = express.Router();
import * as usersController from "../../controllers/usersController";
import * as listingsController from "../../controllers/jobPostingController";
import * as applicationController from "../../controllers/applicationController";
import verifyRoles from "../../middleware/verifyRoles";
import ROLES_LIST from "../../config/roles_list";

router.route("/").get(usersController.getMe).patch(usersController.updateMe);

router
  .route("/save")
  // save listing
  .post(verifyRoles(ROLES_LIST.User), listingsController.saveListingToUser);

router
  .route("/saved")
  // get saved listings
  .post(verifyRoles(ROLES_LIST.User), listingsController.getSavedAppliedByUser);

router
  .route("/all_saved")
  // get saved listings
  .post(verifyRoles(ROLES_LIST.User), listingsController.getAllSavedByUser);

router
  .route("/applications/view")
  .post(
    verifyRoles(ROLES_LIST.User),
    applicationController.getApplicationFromListing
  );

router
  .route("/add-resource")
  .post(verifyRoles(ROLES_LIST.User), usersController.addResourceToMe);

router
  .route("/notifications")
  .get(verifyRoles(ROLES_LIST.User), usersController.getNotifications);

router
  .route("/applications")
  .post(verifyRoles(ROLES_LIST.User), listingsController.getAppliedListings);

export default router;
