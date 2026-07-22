import express from "express";
import {
  getInspirationById,
  markInspirationHeard,
  toggleFavoriteInspiration,
} from "../controller/inspiration.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", protect, getInspirationById);
router.patch("/:id/heard", protect, markInspirationHeard);
router.patch("/:id/favorite", protect, toggleFavoriteInspiration);

export default router;
