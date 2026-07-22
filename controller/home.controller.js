import httpStatus from "http-status";
import Reflection from "../model/reflection.model.js";
import Announcement from "../model/announcement.model.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { getOrCreateTodayJournal } from "./journal.controller.js";

// GET /home  -> Home screen
export const getHome = catchAsync(async (req, res) => {
  const journal = await getOrCreateTodayJournal(req.user._id);
  await journal.populate("meditations.meditation");
  await journal.populate("inspirations.inspiration");

  const reflection = await Reflection.findOne({ isActive: true }).sort(
    "-date"
  );
  const announcement = await Announcement.findOne({ isActive: true })
    .sort("-createdAt")
    .populate("linkedMeditation");

  const totalDays = req.user.challenge?.totalDays || 28;
  const currentDay = req.user.challenge?.currentDay || 1;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Home data fetched successfully",
    data: {
      greetingName: req.user.userName,
      todaysReflection: reflection,
      challenge: {
        totalDays,
        currentDay: Math.min(currentDay, totalDays),
        completedDays: req.user.challenge?.completedDays || [],
      },
      todaysMeditation: journal.meditations,
      todaysAction: {
        inspiration: journal.inspirations[0] || null,
        journalPrompt: journal.journalPrompt,
        journalAnswer: journal.journalAnswer,
      },
      latestAnnouncement: announcement,
    },
  });
});
