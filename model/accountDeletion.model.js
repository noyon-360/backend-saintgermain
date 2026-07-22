import mongoose, { Schema } from "mongoose";

// Keeps a record of why users deleted their account (from the Delete Account screen)
const accountDeletionSchema = new Schema(
  {
    email: { type: String, required: true },
    reason: {
      type: String,
      enum: [
        "I don't use the app anymore",
        "I'm concerned about my privacy",
        "I'm taking a break",
        "I'm creating a different account",
        "The app doesn't meet my needs",
        "I experienced technical issues",
        "Other reason",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const AccountDeletion = mongoose.model(
  "AccountDeletion",
  accountDeletionSchema
);
export default AccountDeletion;
