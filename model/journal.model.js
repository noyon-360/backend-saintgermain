import mongoose, { Schema } from "mongoose";

// One document per user per calendar day ("dateKey" = YYYY-MM-DD)
// Powers the Home / Journey / Journal screens.
const journalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateKey: {
      type: String, // "2026-07-15"
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    // "Today's Activity" checklist e.g. Sit quietly for 5 minutes
    activities: [
      {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    // "Today's Meditation" list for the day
    meditations: [
      {
        meditation: { type: Schema.Types.ObjectId, ref: "Meditation" },
        completed: { type: Boolean, default: false },
      },
    ],
    // "Today's Inspiration"
    inspirations: [
      {
        inspiration: { type: Schema.Types.ObjectId, ref: "Inspiration" },
        heard: { type: Boolean, default: false },
      },
    ],
    // Journal prompt e.g. "What are you grateful for today?"
    journalPrompt: {
      type: String,
      default: "What are you grateful for today?",
    },
    journalAnswer: {
      type: String,
      default: "",
    },
    // 1-28, which day of the challenge this entry represents
    challengeDay: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

journalSchema.index({ user: 1, dateKey: 1 }, { unique: true });

const Journal = mongoose.model("Journal", journalSchema);
export default Journal;
