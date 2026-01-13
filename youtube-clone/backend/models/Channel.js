import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
   name: { type: String, required: true, unique: true },
    description: String,
    banner: String,
    avatar: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subscribers: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
