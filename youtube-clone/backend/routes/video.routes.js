import express from "express";
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
 searchVideos,
    likeVideo,
    dislikeVideo
} from "../controllers/video.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.post("/", authMiddleware, uploadVideo);
router.get("/search", searchVideos);
router.post("/:id/like", authMiddleware, likeVideo);
router.post("/:id/dislike", authMiddleware, dislikeVideo);


export default router;
