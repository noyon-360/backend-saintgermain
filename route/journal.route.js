import express from "express";
import {
  getJournalByDate,
  getJournalCalendar,
  toggleActivity,
  saveJournalAnswer,
} from "../controller/journal.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getJournalByDate); // journey / journal-of-the-day screen
router.get("/calendar", protect, getJournalCalendar); // journal calendar screen
router.patch("/activity", protect, toggleActivity);
router.post("/prompt", protect, saveJournalAnswer);

export default router;
