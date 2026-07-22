import httpStatus from "http-status";
import CommunitySubscriber from "../model/communitySubscriber.model.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

// GET /community  -> "Coming Soon" screen
export const getCommunityStatus = catchAsync(async (req, res) => {
  const isSubscribed = await CommunitySubscriber.exists({
    user: req.user._id,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Community status fetched",
    data: {
      status: "coming_soon",
      description:
        "Connect with like minded women, share your journey, and grow together.",
      notifyMe: Boolean(isSubscribed),
    },
  });
});

// POST /community/notify-me  -> "Notify me" checkbox
export const toggleNotifyMe = catchAsync(async (req, res) => {
  const existing = await CommunitySubscriber.findOne({ user: req.user._id });

  let notifyMe;
  if (existing) {
    await CommunitySubscriber.deleteOne({ _id: existing._id });
    notifyMe = false;
  } else {
    await CommunitySubscriber.create({ user: req.user._id });
    notifyMe = true;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: notifyMe
      ? "You'll be notified when Community launches"
      : "Notification opted out",
    data: { notifyMe },
  });
});
