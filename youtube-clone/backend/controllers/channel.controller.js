import Channel from "../models/Channel.js";

export const createChannel = async (req, res) => {
  try {
    const existingChannel = await Channel.findOne({ owner: req.user.id });
    if (existingChannel) {
      return res.status(400).json({ message: "Channel already exists" });
    }

    const channel = await Channel.create({
      ...req.body,
      owner: req.user.id
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId)
      .populate("owner", "username");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMyChannel = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const channel = await Channel.findOne({ owner: req.user.id });

    // return null if no channel (NOT error)
    res.status(200).json(channel);
  } catch (error) {
    console.error("getMyChannel error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

