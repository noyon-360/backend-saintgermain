import express from "express";
import {
  getCommunityStatus,
  toggleNotifyMe,
} from "../controller/community.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getCommunityStatus);
router.post("/notify-me", protect, toggleNotifyMe);

export default router;
