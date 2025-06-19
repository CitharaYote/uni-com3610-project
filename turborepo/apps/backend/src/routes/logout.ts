import express from "express";
const router = express.Router();
import * as logoutController from "../controllers/logoutController";

console.log("logout.ts");

router.post("/", logoutController.handleLogout);

export default router;
