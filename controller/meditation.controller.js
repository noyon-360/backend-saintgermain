import httpStatus from "http-status";
import Meditation from "../model/meditation.model.js";
import Journal from "../model/journal.model.js";
import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { getTodayKey } from "../utils/commonMethod.js";
import { getOrCreateTodayJournal } from "./journal.controller.js";

// GET /meditation  -> Meditation listing screen (Today's Meditation + Inspiration)
export const getTodaysMeditation = catchAsync(async (req, res) => {
  const journal = await getOrCreateTodayJournal(req.user._id);
  await journal.populate("meditations.meditation");
  await journal.populate("inspirations.inspiration");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Today's meditation fetched successfully",
    data: {
      meditations: journal.meditations,
      inspirations: journal.inspirations,
    },
  });
});

// GET /meditation/all  -> browse all poses
export const getAllMeditations = catchAsync(async (req, res) => {
  const { category, page = 1, limit = 20 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Meditation.find(filter).skip(skip).limit(Number(limit)).sort("-createdAt"),
    Meditation.countDocuments(filter),
  ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meditations fetched successfully",
    data: items,
    meta: { page: Number(page), limit: Number(limit), total },
  });
});

// GET /meditation/:id  -> Yoga/Meditation detail screen
export const getMeditationById = catchAsync(async (req, res) => {
  const meditation = await Meditation.findById(req.params.id);
  if (!meditation) {
    throw new AppError(httpStatus.NOT_FOUND, "Meditation not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meditation fetched successfully",
    data: meditation,
  });
});

// PATCH /meditation/:id/complete  -> "Mark as complete" button
export const markMeditationComplete = catchAsync(async (req, res) => {
  const { id } = req.params;

  const journal = await getOrCreateTodayJournal(req.user._id);

  const entry = journal.meditations.find(
    (m) => m.meditation.toString() === id
  );

  if (!entry) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This meditation is not scheduled for today"
    );
  }

  entry.completed = true;
  await journal.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Marked as complete",
    data: journal,
  });
});
