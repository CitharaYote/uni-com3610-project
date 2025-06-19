import express from "express";
const router = express.Router();
import * as applicationController from "../../controllers/applicationController";
import ROLES_LIST from "../../config/roles_list";
import verifyRoles from "../../middleware/verifyRoles";

// router
//   .route("/")
//   .get(verifyRoles(ROLES_LIST.User), applicationController.g)
//   .post(applicationController.createApplication);

router
  .route("/new")
  .post(
    verifyRoles(ROLES_LIST.User),
    applicationController.handleNewApplication
  );

export default router;
