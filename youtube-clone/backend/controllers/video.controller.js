import mongoose from "mongoose";
import Video from "../models/Video.js";
import checkRequiredFields from "../utils/requiredFields.js";

/* ================= UPLOAD VIDEO ================= */
export const uploadVideo = async (req, res) => {
  const { title, description, videoUrl, thumbnail } = req.body;

  const missingFields = checkRequiredFields({ title, videoUrl, thumbnail });
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "fail",
      message: `Missing fields: ${missingFields.join(", ")}`
    });
  }

  const video = await Video.create({
    title,
    description,
    videoUrl,
    thumbnail,
    channel: req.user._id
  });

  res.status(201).json({
    status: "success",
    video
  });
};

/* ================= GET ALL VIDEOS ================= */
export const getAllVideos = async (req, res) => {
  const videos = await Video.find().populate("channel", "name avatar");

  res.status(200).json({
    status: "success",
    results: videos.length,
    videos
  });
};

/* ================= SEARCH VIDEOS ================= */
export const searchVideos = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({
      status: "fail",
      message: "Search query is required"
    });
  }

  const videos = await Video.find(
    { $text: { $search: q } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .populate("channel", "name avatar")
    .limit(20);

  res.status(200).json({
    status: "success",
    results: videos.length,
    videos
  });
};

/* ================= GET VIDEO BY ID ================= */
export const getVideoById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid video id"
    });
  }

  const video = await Video.findById(id).populate(
    "channel",
    "name avatar subscribers"
  );

  if (!video) {
    return res.status(404).json({
      status: "fail",
      message: "Video not found"
    });
  }

  video.views += 1;
  await video.save();

  res.status(200).json({
    status: "success",
    video
  });
};

/* ================= LIKE VIDEO ================= */
export const likeVideo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid video id"
    });
  }

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({
      status: "fail",
      message: "Video not found"
    });
  }

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
    dislikes: video.dislikes.length
  });
};

/* ================= DISLIKE VIDEO ================= */
export const dislikeVideo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid video id"
    });
  }

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).json({
      status: "fail",
      message: "Video not found"
    });
  }

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
    dislikes: video.dislikes.length
  });
};

/* ================= DELETE VIDEO ================= */
/* ================= DELETE VIDEO ================= */
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid video id"
    });
  }

  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).json({
      status: "fail",
      message: "Video not found"
    });
  }

  // check ownership
  if (video.channel.toString() !== userId.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "You are not allowed to delete this video"
    });
  }

  await video.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Video deleted successfully"
  });
};
