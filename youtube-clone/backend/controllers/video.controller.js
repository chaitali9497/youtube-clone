import mongoose from "mongoose";
import Video from "../models/Video.js";
import checkRequiredFields from "../utils/requiredFields.js";
import AppError from "../utils/AppError.js";

/* ================= UPLOAD VIDEO ================= */
export const uploadVideo = async (req, res, next) => {
  const { title, description, videoUrl, thumbnail } = req.body;

  const missingFields = checkRequiredFields({ title, videoUrl, thumbnail });
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(", ")}`, 400)
    );
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
export const searchVideos = async (req, res, next) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return next(new AppError("Search query is required", 400));
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
export const getVideoById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid video id", 400));
  }

  const video = await Video.findById(id).populate(
    "channel",
    "name avatar subscribers"
  );

  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  video.views += 1;
  await video.save();

  res.status(200).json({
    status: "success",
    video
  });
};

/* ================= LIKE VIDEO ================= */
export const likeVideo = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid video id", 400));
  }

  const video = await Video.findById(id);
  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  video.dislikes = video.dislikes.filter(
    (uid) => uid.toString() !== userId.toString()
  );

  const alreadyLiked = video.likes.some(
    (uid) => uid.toString() === userId.toString()
  );

  if (alreadyLiked) {
    video.likes = video.likes.filter(
      (uid) => uid.toString() !== userId.toString()
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
export const dislikeVideo = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid video id", 400));
  }

  const video = await Video.findById(id);
  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  video.likes = video.likes.filter(
    (uid) => uid.toString() !== userId.toString()
  );

  const alreadyDisliked = video.dislikes.some(
    (uid) => uid.toString() === userId.toString()
  );

  if (alreadyDisliked) {
    video.dislikes = video.dislikes.filter(
      (uid) => uid.toString() !== userId.toString()
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
