import mongoose from "mongoose";
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import Comment from "../models/Comment.js";

/* ================= UPLOAD VIDEO ================= */
export const uploadVideo = async (req, res) => {
  const { title, description, videoUrl, thumbnail } = req.body;

  if (!title || !videoUrl || !thumbnail) {
    return res.status(400).json({
      status: "fail",
      message: "Missing required fields",
    });
  }

  const channel = await Channel.findOne({ owner: req.user._id });
  if (!channel) {
    return res.status(400).json({
      status: "fail",
      message: "User does not have a channel",
    });
  }

  const video = await Video.create({
    title,
    description,
    videoUrl,
    thumbnail,
    channel: channel._id,
    commentsCount: 0,
  });

  await Comment.insertMany([
    {
      text: "Great video! 🔥",
      video: video._id,
      user: req.user._id,
      likes: [],
    },
    {
      text: "Thanks for watching 😊",
      video: video._id,
      user: req.user._id,
      likes: [],
    },
  ]);

  await Video.findByIdAndUpdate(video._id, {
    $inc: { commentsCount: 2 },
  });

  res.status(201).json({
    status: "success",
    video,
  });
};

/* ================= GET ALL VIDEOS ================= */
export const getAllVideos = async (req, res) => {
  const videos = await Video.find()
    .populate("channel", "name avatar subscribers")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: videos.length,
    videos,
  });
};

/* ================= GET VIDEO BY ID ================= */
export const getVideoById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid video id",
    });
  }

  const video = await Video.findById(id).populate(
    "channel",
    "name avatar subscribers"
  );

  if (!video) {
    return res.status(404).json({
      status: "fail",
      message: "Video not found",
    });
  }

  // increment views atomically
  await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });

  const userId = req.user?._id;

  res.status(200).json({
    status: "success",
    video,
    likes: video.likes.length,
    dislikes: video.dislikes.length,
    likedByUser: userId
      ? video.likes.some(uid => uid.toString() === userId.toString())
      : false,
    dislikedByUser: userId
      ? video.dislikes.some(uid => uid.toString() === userId.toString())
      : false,
  });
};

/* ================= LIKE VIDEO ================= */
export const likeVideo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid video id",
    });
  }

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({
      status: "fail",
      message: "Video not found",
    });
  }

  const alreadyLiked = video.likes.some(
    uid => uid.toString() === userId.toString()
  );

  let updatedVideo;

  if (alreadyLiked) {
    // UNLIKE
    updatedVideo = await Video.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
  } else {
    // LIKE
    updatedVideo = await Video.findByIdAndUpdate(
      id,
      {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId },
      },
      { new: true }
    );
  }

  res.status(200).json({
    status: "success",
    likes: updatedVideo.likes.length,
    dislikes: updatedVideo.dislikes.length,
    likedByUser: !alreadyLiked,
    dislikedByUser: false,
  });
};

/* ================= DISLIKE VIDEO ================= */
export const dislikeVideo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid video id",
    });
  }

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({
      status: "fail",
      message: "Video not found",
    });
  }

  const alreadyDisliked = video.dislikes.some(
    uid => uid.toString() === userId.toString()
  );

  let updatedVideo;

  if (alreadyDisliked) {
    // REMOVE DISLIKE
    updatedVideo = await Video.findByIdAndUpdate(
      id,
      { $pull: { dislikes: userId } },
      { new: true }
    );
  } else {
    // DISLIKE
    updatedVideo = await Video.findByIdAndUpdate(
      id,
      {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId },
      },
      { new: true }
    );
  }

  res.status(200).json({
    status: "success",
    likes: updatedVideo.likes.length,
    dislikes: updatedVideo.dislikes.length,
    likedByUser: false,
    dislikedByUser: !alreadyDisliked,
  });
};

/* ================= DELETE VIDEO ================= */
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid video id" });
  }

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  const channel = await Channel.findById(video.channel);
  if (!channel || channel.owner.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Not allowed to delete video" });
  }

  await Comment.deleteMany({ video: video._id });
  await video.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Video deleted successfully",
  });
};

/* ================= UPDATE VIDEO ================= */
export const updateVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid video id" });
  }

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  const channel = await Channel.findById(video.channel);
  if (!channel || channel.owner.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Not allowed to edit video" });
  }

  if (title !== undefined) video.title = title;
  if (description !== undefined) video.description = description;

  await video.save();

  res.status(200).json({
    status: "success",
    video,
  });
};
