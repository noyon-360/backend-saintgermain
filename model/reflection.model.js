import mongoose, { Schema } from "mongoose";

// "Today's Reflection" quote shown on Home screen
const reflectionSchema = new Schema(
  {
    quote: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Reflection = mongoose.model("Reflection", reflectionSchema);
export default Reflection;
