import express from "express";
import { createChannel } from "../controllers/channel.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createChannel);

export default router;
