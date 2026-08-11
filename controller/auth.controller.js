import httpStatus from "http-status";
import User from "../model/user.model.js";
import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { createToken } from "../utils/authToken.js";
import { generateOTP } from "../utils/commonMethod.js";
import { sendEmail, otpEmailTemplate } from "../utils/sendEmail.js";

// // POST /auth/register  (Sign up screen: userName, email, password, confirmPassword)
// export const register = catchAsync(async (req, res) => {
//   const { userName, email, password, confirmPassword } = req.body;

//   if (!userName || !email || !password || !confirmPassword) {
//     throw new AppError(httpStatus.BAD_REQUEST, "All fields are required");
//   }

//   if (password !== confirmPassword) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Passwords do not match");
//   }

//   if (String(password).length < 6) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Password must be at least 6 characters"
//     );
//   }

//   const exists = await User.findOne({ email: email.toLowerCase().trim() });
//   if (exists) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
//   }

//   const user = await User.create({
//     userName,
//     email: email.toLowerCase().trim(),
//     password,
//   });

//   const otp = generateOTP(5);
//   user.setOTP(otp);
//   await user.save();

//   try {
//     await sendEmail(
//       user.email,
//       "Verify Your Email - Lumora",
//       otpEmailTemplate({ title: "Verify Your Email", otp })
//     );
//   } catch (err) {
//     console.error("Email send failed:", err.message);
//   }

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: "Registered successfully. Verification code sent to email.",
//     data: {
//       email: user.email,
//       otp, // TODO: remove in production, kept for dev/testing
//     },
//   });
// });

// // POST /auth/verify-email  (Verify OTP screen)
// export const verifyEmail = catchAsync(async (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email and OTP are required");
//   }

//   const user = await User.findOne({
//     email: email.toLowerCase().trim(),
//   }).select("+otp.code +otp.expiresAt");

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }

//   if (!user.isOTPValid(otp)) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
//   }

//   user.isEmailVerified = true;
//   user.clearOTP();
//   await user.save();

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Email verified successfully",
//     data: { email: user.email },
//   });
// });



// POST /auth/register
export const register = catchAsync(async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;

  if (!userName || !email || !password || !confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "All fields are required");
  }

  if (password !== confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Passwords do not match");
  }

  if (String(password).length < 6) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password must be at least 6 characters"
    );
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  const user = await User.create({
    userName,
    email: email.toLowerCase().trim(),
    password,
    isEmailVerified: false, // register korle unverified thakbe, verify-email call korle true hobe
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registered successfully. Please verify your email.",
    data: {
      email: user.email,
      // isEmailVerified: user.isEmailVerified,
    },
  });
});

// POST /auth/verify-email
export const verifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isEmailVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is already verified");
  }

  user.isEmailVerified = true;
  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email verified successfully",
    data: { email: user.email, isEmailVerified: user.isEmailVerified },
  });
});


// POST /auth/resend-otp
export const resendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const otp = generateOTP(5);
  user.setOTP(otp);
  await user.save();

  try {
    await sendEmail(
      user.email,
      "Your New Verification Code - Luminous Thoughts",
      otpEmailTemplate({ title: "Verify Your Email", otp })
    );
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP resent successfully",
    data: { email: user.email, otp },
  });
});

// POST /auth/login  (Sign in screen)
// export const login = catchAsync(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Email and password are required"
//     );
//   }

//   const user = await User.findOne({
//     email: email.toLowerCase().trim(),
//   }).select("+password");

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }

//   if (user.isBlocked) {
//     throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked");
//   }

//   const match = await user.comparePassword(password);
//   if (!match) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
//   }

//   if (!user.isEmailVerified) {
//     // auto send otp again so user can verify
//     const otp = generateOTP(5);
//     user.setOTP(otp);
//     await user.save();
//     try {
//       await sendEmail(
//         user.email,
//         "Verify Your Email - Lumora",
//         otpEmailTemplate({ title: "Verify Your Email", otp })
//       );
//     } catch (err) {
//       console.error("Email send failed:", err.message);
//     }
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       "Email not verified. A new OTP has been sent to your email."
//     );
//   }

//   const payload = { _id: user._id, email: user.email, role: user.role };

//   const accessToken = createToken(
//     payload,
//     process.env.JWT_ACCESS_SECRET,
//     "7d"
//   );
//   const refreshToken = createToken(
//     payload,
//     process.env.JWT_REFRESH_SECRET,
//     "30d"
//   );

//   user.refreshToken = refreshToken;
//   await user.save();

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Login successful",
//     data: {
//       _id: user._id,
//       userName: user.userName,
//       email: user.email,
//       role: user.role,
//       profileImage: user.profileImage,
//       isEmailVerified: user.isEmailVerified,
//       accessToken,
//       refreshToken,
//     },
//   });
// });



export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email and password are required"
    );
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked");
  }

  const match = await user.comparePassword(password);
  if (!match) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Email not verified. Please verify your email first."
    );
  }

  const payload = { _id: user._id, email: user.email, role: user.role };

  const accessToken = createToken(
    payload,
    process.env.JWT_ACCESS_SECRET,
    "7d"
  );
  const refreshToken = createToken(
    payload,
    process.env.JWT_REFRESH_SECRET,
    "30d"
  );

  user.refreshToken = refreshToken;
  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
      accessToken,
      refreshToken,
    },
  });
});

// POST /auth/forget-password  (Forgot password screen -> Send OTP)
export const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const otp = generateOTP(5);
  user.setResetPasswordOTP(otp);
  await user.save();

  try {
    await sendEmail(
      user.email,
      "Reset Your Password - Lumora",
      otpEmailTemplate({
        title: "Reset Your Password",
        otp,
        subtitle: "Enter this code to reset your password",
      })
    );
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your email",
    data: { email: user.email, otp },
  });
});

// POST /auth/verify-reset-otp  (Verify OTP screen, reset-password flow)
export const verifyResetPasswordOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email and OTP are required");
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+resetPasswordOtp.code +resetPasswordOtp.expiresAt");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.isResetPasswordOTPValid(otp)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully",
    data: { email: user.email, resetOtpVerified: true },
  });
});

// POST /auth/reset-password  (Set Your New Password screen)
export const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, password, confirmPassword } = req.body;

  if (!email || !otp || !password || !confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "All fields are required");
  }

  if (password !== confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Passwords do not match");
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select(
    "+password +resetPasswordOtp.code +resetPasswordOtp.expiresAt"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // if (!user.isResetPasswordOTPValid(otp)) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  // }

  user.password = password;
  user.clearResetPasswordOTP();
  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful",
    data: null,
  });
});

// POST /auth/logout
export const logout = catchAsync(async (req, res) => {
  const userId = req.user?._id;

  if (userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: "" });
  }

  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
    data: {},
  });
});
