 import express from "express";
import { addComment, getComments } from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:videoId", getComments);
router.post("/:videoId", protect, addComment);

export default router;
                                                                                              