import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  addComment,
  deleteComment,
  editComment,
  replyToComment,
  toggleLikeComment,
  getComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:videoId", getComments);
router.post("/:videoId", authMiddleware, addComment);

router.put("/like/:commentId", authMiddleware, toggleLikeComment);
router.put("/edit/:commentId", authMiddleware, editComment);
router.delete("/:commentId", authMiddleware, deleteComment);
router.post("/reply/:commentId", authMiddleware, replyToComment);

export default router;
