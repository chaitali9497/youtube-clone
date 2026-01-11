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
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);



videoSchema.index({ title: "text", description: "text" });



export default mongoose.model("Video", videoSchema);
