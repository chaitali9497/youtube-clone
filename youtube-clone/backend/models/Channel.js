import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    avatar: {
      type: String,
      default: ""
    },
    banner: {
      type: String,
      default: ""
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // 🔥 one channel per user
    },
    subscribers: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
