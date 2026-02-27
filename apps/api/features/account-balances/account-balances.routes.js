import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import * as controller from "./account-balances.controller.js";

const router = express.Router();

router.post("/", verifyToken, controller.upsert);
router.get("/", verifyToken, controller.getAll);

export default router;
