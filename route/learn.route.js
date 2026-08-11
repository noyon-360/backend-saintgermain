import express from "express";
import {
  getLearnContent,
  getLearnContentById,
  toggleLike,
  registerDownload,
  registerShare,
  createLearnContent
} from "../controller/learn.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/", protect, createLearnContent);
router.get("/", protect, getLearnContent);
router.get("/:id", protect, getLearnContentById);
router.patch("/:id/like", protect, toggleLike);
router.patch("/:id/download", protect, registerDownload);
router.patch("/:id/share", protect, registerShare);

export default router;
