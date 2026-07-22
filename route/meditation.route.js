import express from "express";
import {
  getTodaysMeditation,
  getAllMeditations,
  getMeditationById,
  markMeditationComplete,
} from "../controller/meditation.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getTodaysMeditation);
router.get("/all", protect, getAllMeditations);
router.get("/:id", protect, getMeditationById);
router.patch("/:id/complete", protect, markMeditationComplete);

export default router;
