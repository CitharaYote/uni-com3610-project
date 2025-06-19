import express from "express";
const router = express.Router();
import * as refreshTokenController from "../controllers/refreshTokenController";

router.get("/", refreshTokenController.handleRefreshToken);

export default router;
