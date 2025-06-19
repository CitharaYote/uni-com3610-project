import express from "express";
const router = express.Router();
import * as listingsController from "../../controllers/jobPostingController";
import verifyRoles from "../../middleware/verifyRoles";
import ROLES_LIST from "../../config/roles_list";

router
  .route("/recent")
  // get paginated listings
  .get(listingsController.getRecentPostingsPublicPaginated);

router
  .route("/ending-soon")
  // get paginated listings
  .get(listingsController.getEndingSoonPostingsPublicPaginated);

// router
//   .route("/:id")
//   // get single listing
//   .get(listingsController.getJobPostingPublic);

router
  .route("/search-options")
  // get search options
  .get(listingsController.getSearchOptions);

router
  .route("/search")
  // search listings
  .post(listingsController.searchFilterPublicPostingsPaginated);

export default router;
