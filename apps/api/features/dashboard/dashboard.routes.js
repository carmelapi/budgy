import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import * as dashboardController from "./dashboard.controller.js";

const router = express.Router();

router.get("/summary", verifyToken, dashboardController.getSummary);

export default router;
