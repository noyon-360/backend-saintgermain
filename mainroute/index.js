import express from "express";

import authRoute from "../route/auth.route.js";
import userRoute from "../route/user.route.js";
import homeRoute from "../route/home.route.js";
import meditationRoute from "../route/meditation.route.js";
import inspirationRoute from "../route/inspiration.route.js";
import journalRoute from "../route/journal.route.js";
import learnRoute from "../route/learn.route.js";
import notificationRoute from "../route/notification.route.js";
import communityRoute from "../route/community.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/home", homeRoute);
router.use("/meditation", meditationRoute);
router.use("/inspiration", inspirationRoute);
router.use("/journal", journalRoute);
router.use("/learn", learnRoute);
router.use("/notification", notificationRoute);
router.use("/community", communityRoute);

export default router;
