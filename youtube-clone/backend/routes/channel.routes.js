import express from "express";
import {
  createChannel,
  getChannelById,
  getMyChannel
} from "../controllers/channel.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChannel);          // create channel
router.get("/me", authMiddleware, getMyChannel);          //  my channel
router.get("/:channelId", getChannelById);         // public channel

export default router;
