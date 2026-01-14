import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

/* ================= ADD COMMENT ================= */
export const addComment = async (req, res) => {
  const { text } = req.body;
  const { videoId } = req.params;

  if (!text) {
    return res.status(400).json({
      status: "fail",
      message: "Comment text is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid video id",
    });
  }

  const comment = await Comment.create({
    text,
    video: videoId,
    user: req.user._id,
    likes: [], // ✅ array
  });

  //  increase comment count
  await Video.findByIdAndUpdate(videoId, {
    $inc: { commentsCount: 1 },
  });

  const populatedComment = await comment.populate(
    "user",
    "name avatar"
  );

  res.status(201).json(populatedComment);
};

/* ================= GET COMMENTS ================= */
export const getComments = async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.find({
    video: videoId,
    parentComment: null, // only top-level comments
  })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });

  res.status(200).json(comments);
};

/* ================= LIKE / UNLIKE COMMENT ================= */
export const toggleLikeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: "Invalid comment id" });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const alreadyLiked = comment.likes.some(
    (id) => id.toString() === userId.toString()
  );

  if (alreadyLiked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);
  }

  await comment.save();

  res.status(200).json({
    likes: comment.likes.length,
    likedByUser: !alreadyLiked,
  });
};

/* ================= EDIT OWN COMMENT ================= */
export const editComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  comment.text = text;
  await comment.save();

  res.status(200).json(comment);
};

/* ================= DELETE OWN COMMENT ================= */
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await comment.deleteOne();

  //  decrease comment count
  await Video.findByIdAndUpdate(comment.video, {
    $inc: { commentsCount: -1 },
  });

  res.status(200).json({ message: "Comment deleted" });
};

/* ================= REPLY TO COMMENT ================= */
export const replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  const parent = await Comment.findById(commentId);
  if (!parent) {
    return res.status(404).json({ message: "Parent comment not found" });
  }

  const reply = await Comment.create({
    text,
    video: parent.video,
    user: req.user._id,
    parentComment: parent._id,
    likes: [],
  });

  //  increase comment count
  await Video.findByIdAndUpdate(parent.video, {
    $inc: { commentsCount: 1 },
  });

  const populatedReply = await reply.populate(
    "user",
    "name avatar"
  );

  res.status(201).json(populatedReply);
};
