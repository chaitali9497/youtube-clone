import express from "express";
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  likeVideo,
  dislikeVideo,
  deleteVideo,      // ✅ ADD
  updateVideo,      // ✅ ADD
} from "../controllers/video.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/* ===== STATIC ROUTES FIRST ===== */
router.get("/search", (req, res) => {
  res.status(501).json({ message: "Search not implemented yet" });
});

/* ===== COLLECTION ROUTES ===== */
router.get("/", getAllVideos);
router.post("/", authMiddleware, uploadVideo);

/* ===== DYNAMIC ROUTES LAST ===== */
router.get("/:id", getVideoById);
router.patch("/:id", authMiddleware, updateVideo); 
router.delete("/:id", authMiddleware, deleteVideo); 
router.post("/:id/like", authMiddleware, likeVideo);
router.post("/:id/dislike", authMiddleware, dislikeVideo);

export default router;
