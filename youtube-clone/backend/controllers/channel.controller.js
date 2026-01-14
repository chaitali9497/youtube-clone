import Channel from "../models/Channel.js";
import Video from "../models/Video.js"; 

/* ================= CREATE CHANNEL ================= */
export const createChannel = async (req, res) => {
  try {
    const existingChannel = await Channel.findOne({
      owner: req.user.id,
    });

    if (existingChannel) {
      return res.status(400).json({
        message: "Channel already exists",
      });
    }

    // CREATE CHANNEL
    const channel = await Channel.create({
      ...req.body,
      owner: req.user.id,
    });

    // CREATE 2 DEFAULT VIDEOS FOR THE CHANNEL
    const defaultVideos = await Video.insertMany([
      {
        title: "Welcome to my channel 🎉",
        description: "This is my first video on this channel.",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail:
          "https://via.placeholder.com/320x180?text=Welcome+Video",
        channel: channel._id,
        commentsCount: 0,
      },
      {
        title: "Channel Introduction 📢",
        description: "Let me introduce what this channel is about.",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail:
          "https://via.placeholder.com/320x180?text=Intro+Video",
        channel: channel._id,
        commentsCount: 0,
      },
    ]);

    res.status(201).json({
      status: "success",
      channel,
      videos: defaultVideos,
    });
  } catch (error) {
    console.error("createChannel error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= GET CHANNEL + VIDEOS (JOIN) ================= */
export const getChannelById = async (req, res) => {
  try {
   
    const channel = await Channel.findById(req.params.channelId)
      .populate("owner", "username");

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

  
    const videos = await Video.find({
      channel: channel._id,
    }).sort({ createdAt: -1 });

   
    res.status(200).json({
      channel,
      videos,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= GET MY CHANNEL ================= */
export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({
      owner: req.user.id,
    });

    res.status(200).json(channel); // null if not exists
  } catch (error) {
    console.error("getMyChannel error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
