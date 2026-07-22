import httpStatus from "http-status";
import Journal from "../model/journal.model.js";
import Meditation from "../model/meditation.model.js";
import Inspiration from "../model/inspiration.model.js";
import User from "../model/user.model.js";
import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { getTodayKey } from "../utils/commonMethod.js";

const DEFAULT_ACTIVITIES = [
  "Sit quitely for 5 minutes",
  "Think of one difficult moment today",
  "Walk for 10 minutes",
];

// Creates today's journal entry for a user if it doesn't exist yet,
// seeding it with default activities + up to 3 meditations + 2 inspirations.
// Exported so meditation/inspiration/home controllers can reuse it.
export const getOrCreateTodayJournal = async (userId, dateInput) => {
  const date = dateInput ? new Date(dateInput) : new Date();
  const dateKey = getTodayKey(date);

  let journal = await Journal.findOne({ user: userId, dateKey });
  if (journal) return journal;

  const user = await User.findById(userId);

  // Start the 28 day challenge if this is the user's first journal entry
  if (!user.challenge?.startDate) {
    user.challenge.startDate = date;
    user.challenge.currentDay = 1;
    await user.save();
  }

  const daysSinceStart =
    Math.floor(
      (date.setHours(0, 0, 0, 0) -
        new Date(user.challenge.startDate).setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const challengeDay = Math.min(
    Math.max(daysSinceStart, 1),
    user.challenge.totalDays || 28
  );

  const meditations = await Meditation.find({ isActive: true })
    .sort("-createdAt")
    .limit(3);
  const inspirations = await Inspiration.find({ isActive: true })
    .sort("-createdAt")
    .limit(2);

  journal = await Journal.create({
    user: userId,
    dateKey,
    date,
    activities: DEFAULT_ACTIVITIES.map((text) => ({ text, completed: false })),
    meditations: meditations.map((m) => ({ meditation: m._id, completed: false })),
    inspirations: inspirations.map((i) => ({ inspiration: i._id, heard: false })),
    challengeDay,
  });

  return journal;
};

// GET /journey  or  GET /journal?date=YYYY-MM-DD
export const getJournalByDate = catchAsync(async (req, res) => {
  const { date } = req.query;
  const journal = await getOrCreateTodayJournal(req.user._id, date);
  await journal.populate("meditations.meditation");
  await journal.populate("inspirations.inspiration");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Journal fetched successfully",
    data: journal,
  });
});

// GET /journal/calendar?month=7&year=2026  -> Journal calendar screen
export const getJournalCalendar = catchAsync(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month || now.getMonth() + 1); // 1-12
  const year = Number(req.query.year || now.getFullYear());

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const entries = await Journal.find({
    user: req.user._id,
    date: { $gte: start, $lt: end },
  }).select("dateKey challengeDay activities meditations inspirations journalAnswer");

  const user = await User.findById(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Calendar fetched successfully",
    data: {
      month,
      year,
      entries,
      challenge: user.challenge,
    },
  });
});

// PATCH /journal/activity  { activityIndex, completed }
export const toggleActivity = catchAsync(async (req, res) => {
  const { activityIndex, completed, date } = req.body;

  if (activityIndex === undefined) {
    throw new AppError(httpStatus.BAD_REQUEST, "activityIndex is required");
  }

  const journal = await getOrCreateTodayJournal(req.user._id, date);

  if (!journal.activities[activityIndex]) {
    throw new AppError(httpStatus.NOT_FOUND, "Activity not found");
  }

  journal.activities[activityIndex].completed =
    typeof completed === "boolean"
      ? completed
      : !journal.activities[activityIndex].completed;

  await journal.save();
  await maybeCompleteChallengeDay(req.user._id, journal);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Activity updated",
    data: journal,
  });
});

// POST /journal/prompt  { answer }  -> "Journal Prompt" modal Save button
export const saveJournalAnswer = catchAsync(async (req, res) => {
  const { answer, date } = req.body;

  if (!answer) {
    throw new AppError(httpStatus.BAD_REQUEST, "Answer is required");
  }

  const journal = await getOrCreateTodayJournal(req.user._id, date);
  journal.journalAnswer = answer;
  await journal.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Journal saved successfully",
    data: journal,
  });
});

// Marks the user's challenge day as complete once all of today's
// activities + meditations are done, and advances currentDay.
async function maybeCompleteChallengeDay(userId, journal) {
  const allActivitiesDone = journal.activities.every((a) => a.completed);
  const allMeditationsDone =
    journal.meditations.length === 0 ||
    journal.meditations.every((m) => m.completed);

  if (!allActivitiesDone || !allMeditationsDone) return;

  const user = await User.findById(userId);
  if (!user.challenge.completedDays.includes(journal.challengeDay)) {
    user.challenge.completedDays.push(journal.challengeDay);
    user.challenge.currentDay = Math.max(
      user.challenge.currentDay,
      journal.challengeDay + 1
    );
    await user.save();
  }
}
