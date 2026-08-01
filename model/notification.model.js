import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    // null user = broadcast notification for all users
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: [
        "meditation",
        "inspiration",
        "book",
        "community",
        "podcast",
        "quote",
        "general",
      ],
      default: "general",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hiddenBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
