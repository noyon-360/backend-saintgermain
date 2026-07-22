import mongoose, { Schema } from "mongoose";

const inspirationSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    artist: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    audioUrl: {
      type: String,
      default: "",
    },
    // in seconds
    duration: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Inspiration = mongoose.model("Inspiration", inspirationSchema);
export default Inspiration;
