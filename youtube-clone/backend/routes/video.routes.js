import express from "express";
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
 searchVideos,
    likeVideo,
    dislikeVideo
} from "../controllers/video.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.post("/", protect, uploadVideo);
router.get("/search", searchVideos);
router.post("/:id/like", protect, likeVideo);
router.post("/:id/dislike", protect, dislikeVideo);


export default router;
