// const express = require('express');
// const router = express.Router();
// const usersController = require('../../controllers/usersController');
// const ROLES_LIST = require('../../config/roles_list');
// const verifyRoles = require('../../middleware/verifyRoles');

import express from "express";
const router = express.Router();
import * as usersController from "../../controllers/usersController";
import ROLES_LIST from "../../config/roles_list";
import verifyRoles from "../../middleware/verifyRoles";

router
  .route("/")
  // .get(usersController.getAllUsers)
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router
  .route("/update")
  .put(verifyRoles(ROLES_LIST.Admin), usersController.updateUser);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

export default router;
