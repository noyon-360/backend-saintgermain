import crypto from "crypto";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";

// Generate a random numeric OTP
export const generateOTP = (length = 5) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
};

export const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
};

export const isOtpExpired = (expiresAt) =>
  !expiresAt || expiresAt.getTime() < Date.now();

// Generate a unique readable id (e.g. for challenges/records)
export const generateUniqueId = (prefix = "LM") => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 6);
  const uniquePart = (timestamp + randomPart).substring(0, 8);
  return `${prefix}${uniquePart}`;
};

export const hashPassword = async (newPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(newPassword, salt);
};

export const uniqueTransactionId = () => {
  return uuidv4().replace(/-/g, "").substr(0, 12).toUpperCase();
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { ...options },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Returns YYYY-MM-DD string for "today" (used to key daily journey records)
export const getTodayKey = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};
