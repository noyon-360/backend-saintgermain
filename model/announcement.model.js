import mongoose, { Schema } from "mongoose";

// "Latest Announcement" banner on Home screen
const announcementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    durationMinutes: {
      type: Number,
      default: 15,
    },
    image: {
      type: String,
      default: "",
    },
    ctaLabel: {
      type: String,
      default: "Start now",
    },
    linkedMeditation: {
      type: Schema.Types.ObjectId,
      ref: "Meditation",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
