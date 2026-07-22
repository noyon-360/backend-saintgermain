import httpStatus from "http-status";
import Inspiration from "../model/inspiration.model.js";
import User from "../model/user.model.js";
import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { getOrCreateTodayJournal } from "./journal.controller.js";

// GET /inspiration/:id  -> Inspiration player screen
export const getInspirationById = catchAsync(async (req, res) => {
  const inspiration = await Inspiration.findById(req.params.id);
  if (!inspiration) {
    throw new AppError(httpStatus.NOT_FOUND, "Inspiration not found");
  }

  const isFavorite = req.user.favoriteInspirations
    .map((id) => id.toString())
    .includes(inspiration._id.toString());

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Inspiration fetched successfully",
    data: { ...inspiration.toObject(), isFavorite },
  });
});

// PATCH /inspiration/:id/heard  -> "Mark as heard" button
export const markInspirationHeard = catchAsync(async (req, res) => {
  const { id } = req.params;
  const journal = await getOrCreateTodayJournal(req.user._id);

  const entry = journal.inspirations.find(
    (i) => i.inspiration.toString() === id
  );
  if (!entry) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This inspiration is not scheduled for today"
    );
  }

  entry.heard = true;
  await journal.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Marked as heard",
    data: journal,
  });
});

// PATCH /inspiration/:id/favorite  -> heart icon toggle
export const toggleFavoriteInspiration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const inspiration = await Inspiration.findById(id);
  if (!inspiration) {
    throw new AppError(httpStatus.NOT_FOUND, "Inspiration not found");
  }

  const user = await User.findById(req.user._id);
  const idx = user.favoriteInspirations.findIndex((f) => f.toString() === id);

  let isFavorite;
  if (idx > -1) {
    user.favoriteInspirations.splice(idx, 1);
    isFavorite = false;
  } else {
    user.favoriteInspirations.push(id);
    isFavorite = true;
  }

  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: isFavorite ? "Added to favorites" : "Removed from favorites",
    data: { isFavorite },
  });
});
