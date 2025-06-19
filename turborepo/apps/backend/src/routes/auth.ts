import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController";

router.post("/", authController.handleLogin);

export default router;
