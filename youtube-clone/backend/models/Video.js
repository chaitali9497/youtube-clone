import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    videoUrl: String,
    thumbnail: String,

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    },

    views: { type: Number, default: 50 },

   likes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  }
],
dislikes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  }
],

    //  NEW: comment count
    commentsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// search index
videoSchema.index({ title: "text", description: "text" });

export default mongoose.model("Video", videoSchema);
