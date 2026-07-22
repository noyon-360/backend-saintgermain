import express from "express";
import {
  getLearnContent,
  getLearnContentById,
  toggleLike,
  registerDownload,
  registerShare,
} from "../controller/learn.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getLearnContent);
router.get("/:id", protect, getLearnContentById);
router.patch("/:id/like", protect, toggleLike);
router.patch("/:id/download", protect, registerDownload);
router.patch("/:id/share", protect, registerShare);

export default router;
