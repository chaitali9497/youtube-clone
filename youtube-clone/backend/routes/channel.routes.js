import express from "express";
import {
  createChannel,
  getChannelById,
  getMyChannel
} from "../controllers/channel.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createChannel);          // create channel
router.get("/me", protect, getMyChannel);          //  my channel
router.get("/:channelId", getChannelById);         // public channel

export default router;
