import mongoose from "mongoose";
import Video from "../models/Video.js";
import checkRequiredFields from "../utils/requiredFields.js";
import Channel from "../models/Channel.js";


/* ================= UPLOAD VIDEO ================= */

export const uploadVideo = async (req, res) => {
  const { title, description, videoUrl, thumbnail } = req.body;

  if (!title || !videoUrl || !thumbnail) {
    return res.status(400).json({
      status: "fail",
      message: "Missing required fields",
    });
  }

  // FIND USER CHANNEL
  const channel = await Channel.findOne({ owner: req.user._id });

  if (!channel) {
    return res.status(400).json({
      status: "fail",
      message: "User does not have a channel",
    });
  }

  // CREATE VIDEO WITH CHANNEL ID
  const video = await Video.create({
    title,
    description,
    videoUrl,
    thumbnail,
    channel: channel._id,
  });

  // CREATE 2 DEFAULT COMMENTS FOR THIS VIDEO
  await Comment.insertMany([
    {
      text: "Great video! 🔥",
      video: video._id,
      user: req.user._id, // channel owner
      likes: 0,
    },
    {
      text: "Thanks for watching 😊",
      video: video._id,
      user: req.user._id,
      likes: 0,
    },
  ]);

  res.status(201).json({
    status: "success",
    video,
  });
};


/* ================= GET ALL VIDEOS ================= */
export const getAllVideos = async (req, res) => {
 const videos = await Video.find()
  .populate("channel", "name avatar subscribers");
  

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
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId)
      .populate("owner", "username");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videos = await Video.find({ channel: channel._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      channel,
      videos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
export const deleteVideo = async (req, res) => {
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

  //  find channel owned by user
  const channel = await Channel.findOne({ owner: userId });

  //  correct ownership check
  if (!channel || video.channel.toString() !== channel._id.toString()) {
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

