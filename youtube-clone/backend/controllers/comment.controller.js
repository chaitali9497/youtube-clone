import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  const comment = await Comment.create({
    text: req.body.text,
    video: req.params.videoId,
    user: req.user._id
  });

  res.status(201).json(comment);
};

export const getComments = async (req, res) => {
  const comments = await Comment.find({ video: req.params.videoId })
    .populate("user", "name avatar");

  res.json(comments);
};
