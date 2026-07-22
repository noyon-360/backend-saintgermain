import express from "express";
import { getHome } from "../controller/home.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getHome);

export default router;
