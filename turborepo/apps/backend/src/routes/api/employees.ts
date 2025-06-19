import express from "express";
const router = express.Router();
import * as employeesController from "../../controllers/employeesController";
import ROLES_LIST from "../../config/roles_list";
import verifyRoles from "../../middleware/verifyRoles";

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Staff),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Staff),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

export default router;
