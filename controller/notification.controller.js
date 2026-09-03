import httpStatus from "http-status";
import Notification from "../model/notification.model.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

// GET /notification  -> grouped into "Today" and "Previous"
export const getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({
    $and: [
      { $or: [{ user: req.user._id }, { user: null }] },
      { hiddenBy: { $ne: req.user._id } },
    ],
  }).sort("-createdAt");

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const today = [];
  const previous = [];

  notifications.forEach((n) => {
    const isRead = n.isRead || n.readBy?.some(
      (id) => id.toString() === req.user._id.toString()
    );
    const item = { ...n.toObject(), isRead };
    if (new Date(n.createdAt) >= startOfToday) {
      today.push(item);
    } else {
      previous.push(item);
    }
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications fetched successfully",
    data: { today, previous },
  });
});

// PATCH /notification/:id/read
export const markNotificationRead = catchAsync(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Notification not found",
    });
  }

  if (notification.user) {
    notification.isRead = true;
  } else if (
    !notification.readBy.some((id) => id.toString() === req.user._id.toString())
  ) {
    notification.readBy.push(req.user._id);
  }

  await notification.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

// DELETE /notification/:id
// User-specific notifications are removed. Broadcast notifications are hidden
// only for the requesting user so they remain available to everyone else.
export const deleteNotification = catchAsync(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    $or: [{ user: req.user._id }, { user: null }],
  });

  if (!notification) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Notification not found",
    });
  }

  if (notification.user) {
    await notification.deleteOne();
  } else if (
    !notification.hiddenBy.some(
      (id) => id.toString() === req.user._id.toString()
    )
  ) {
    notification.hiddenBy.push(req.user._id);
    await notification.save();
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification deleted successfully",
    data: null,
  });
});
