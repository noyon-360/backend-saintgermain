import mongoose, { Schema } from "mongoose";

const learnSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["book", "video"],
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    authorLabel: {
      type: String, // e.g. "MAGNIFICENT WOMAN"
      default: "",
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    contentUrl: {
      type: String, // pdf link / video link
      default: "",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downloadedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

learnSchema.index({ title: "text" });

const Learn = mongoose.model("Learn", learnSchema);
export default Learn;
