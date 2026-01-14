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

  // find channel via JWT user
  const channel = await Channel.findOne({ owner: req.user._id });
  if (!channel) {
    return res.status(400).json({
      status: "fail",
      message: "User does not have a channel",
    });
  }

  // create video
  const video = await Video.create({
    title,
    description,
    videoUrl,
    thumbnail,
    channel: channel._id,
    commentsCount: 0,
  });

  // default comments
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

  const video = await Video.findById(id)
    .populate("channel", "name avatar subscribers");

  if (!video) {
    return res.status(404).json({
      status: "fail",
      message: "Video not found",
    });
  }

  video.views += 1;
  await video.save();

  res.status(200).json({
    status: "success",
    video,
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

  // remove dislike
  video.dislikes = video.dislikes.filter(
    uid => uid.toString() !== userId.toString()
  );

  const alreadyLiked = video.likes.some(
    uid => uid.toString() === userId.toString()
  );

  if (alreadyLiked) {
    video.likes = video.likes.filter(
      uid => uid.toString() !== userId.toString()
    );
  } else {
    video.likes.push(userId);
  }

  await video.save();

  res.status(200).json({
    status: "success",
    likes: video.likes.length,
    dislikes: video.dislikes.length,
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

  // remove like
  video.likes = video.likes.filter(
    uid => uid.toString() !== userId.toString()
  );

  const alreadyDisliked = video.dislikes.some(
    uid => uid.toString() === userId.toString()
  );

  if (alreadyDisliked) {
    video.dislikes = video.dislikes.filter(
      uid => uid.toString() !== userId.toString()
    );
  } else {
    video.dislikes.push(userId);
  }

  await video.save();

  res.status(200).json({
    status: "success",
    likes: video.likes.length,
    dislikes: video.dislikes.length,
  });
};
