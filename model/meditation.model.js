import mongoose, { Schema } from "mongoose";

const meditationSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    // e.g. "15 minutes"
    durationMinutes: {
      type: Number,
      default: 15,
    },
    // how many times per day, shown as "1 time" / "2 time" / "3 time"
    times: {
      type: Number,
      default: 1,
    },
    breakTimeMinutes: {
      type: Number,
      default: 5,
    },
    process: {
      type: String,
      default: "",
    },
    benefits: [{ type: String }],
    category: {
      type: String,
      enum: ["meditation", "yoga"],
      default: "yoga",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Meditation = mongoose.model("Meditation", meditationSchema);
export default Meditation;
