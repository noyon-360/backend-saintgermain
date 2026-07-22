import mongoose, { Schema } from "mongoose";

// Tracks "Notify me" opt-ins for the upcoming Community feature
const communitySubscriberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const CommunitySubscriber = mongoose.model(
  "CommunitySubscriber",
  communitySubscriberSchema
);
export default CommunitySubscriber;
