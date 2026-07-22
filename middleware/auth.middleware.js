import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import User from "../model/user.model.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Token not found");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
  }

  if (user.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  if (!user.isEmailVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "User not verified");
  }

  req.user = user;
  next();
});

// optional auth - attaches user if token valid, but doesn't fail if missing
export const optionalAuth = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded._id);
    if (user) req.user = user;
  } catch (error) {
    // ignore invalid token in optional auth
  }
  next();
});

export const isAdmin = catchAsync(async (req, res, next) => {
  if (req.user?.role !== "admin") {
    throw new AppError(httpStatus.FORBIDDEN, "Access denied. Admin only.");
  }
  next();
});
