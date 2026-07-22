import httpStatus from "http-status";
import User from "../model/user.model.js";
import AccountDeletion from "../model/accountDeletion.model.js";
import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { uploadOnCloudinary } from "../utils/commonMethod.js";

// GET /user/profile
export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched successfully",
    data: user,
  });
});

// PUT /user/profile  (Edit Profile screen: userName, email, phone, address, avatar)
export const updateProfile = catchAsync(async (req, res) => {
  const { userName, phone, address } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (userName) user.userName = userName.trim();
  if (phone) user.phone = phone.trim();
  if (address) user.address = address.trim();

  if (req.file) {
    const upload = await uploadOnCloudinary(req.file.buffer, {
      folder: "lumora/profile",
    });
    user.profileImage = {
      public_id: upload.public_id,
      url: upload.secure_url,
    };
  }

  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

// PUT /user/account/change-password  (Change Password screen)
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Passwords do not match");
  }

  if (currentPassword === newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password must be different from current password"
    );
  }

  if (String(newPassword).length < 6) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password must be at least 6 characters"
    );
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isMatched = await user.comparePassword(currentPassword);
  if (!isMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Current password is incorrect"
    );
  }

  user.password = newPassword;
  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: null,
  });
});

// DELETE /user/account  (Delete Account screen, with reason)
export const deleteAccount = catchAsync(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please select a reason");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  await AccountDeletion.create({ email: user.email, reason });
  await User.findByIdAndDelete(user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account deleted successfully",
    data: null,
  });
});
