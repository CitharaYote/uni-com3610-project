import express from "express";
const router = express.Router();
import * as jobPostingController from "../../controllers/jobPostingController";
import verifyRoles from "../../middleware/verifyRoles";
import ROLES_LIST from "../../config/roles_list";

router
  .route("/")
  .get(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.getAllJobPostingsPaginated
  );
// .post(verifyRoles("Admin"), jobPostingController.createNewJobPosting);

router
  .route("/ending-soon")
  .get(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.getEndingSoonPostingsPaginated
  );

router
  .route("/just-ended")
  .get(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.getJustEndedPostingsPaginated
  );

router
  .route("/recent")
  .get(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.getRecentPostingsPaginated
  );

router
  .route("/new")
  .post(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.createNewJobPosting
  );

router
  .route("/edit")
  .put(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.updateJobPosting
  );

router
  .route("/delete")
  .delete(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.deleteJobPosting
  );

router
  .route("/dashboard")
  .get(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.getStaffListingsDashboard
  );

router
  .route("/:id")
  .get(verifyRoles("Admin"), jobPostingController.getJobPosting)
  .put(verifyRoles("Admin"), jobPostingController.updateJobPosting)
  .delete(verifyRoles("Admin"), jobPostingController.deleteJobPosting);

router
  .route("/search")
  .post(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.searchFilterPostingsPaginated
  );

router
  .route("/applications")
  .post(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.getApplicationsFromListing
  );

router
  .route("/applications/count")
  .post(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.getApplicationNumberFromListing
  );

router
  .route("/applications/update")
  .post(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.updateApplicationStatus
  );

router
  .route("/assign")
  .post(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.addUserToPanel
  );

router
  .route("/panel")
  .post(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.getPanelMembers
  );

router
  .route("/ranking")
  .post(
    verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin),
    jobPostingController.setRanking
  );

export default router;
