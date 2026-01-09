import Channel from "../models/Channel.js";
import checkRequiredFields from "../utils/requiredFields.js";

/* ================= CREATE CHANNEL ================= */
export const createChannel = async (req, res) => {
  const { name, description, avatar, banner } = req.body;
  const userId = req.user._id;

  // validate required fields
  const missingFields = checkRequiredFields({ name });
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "fail",
      message: `Missing fields: ${missingFields.join(", ")}`
    });
  }

  // user already has a channel
  const existingChannel = await Channel.findOne({ owner: userId });
  if (existingChannel) {
    return res.status(400).json({
      status: "fail",
      message: "User already has a channel"
    });
  }

  const channel = await Channel.create({
    name,
    description,
    avatar,
    banner,
    owner: userId
  });

  res.status(201).json({
    status: "success",
    channel
  });
};


/* ================= GET CHANNEL BY ID ================= */
export const getChannelById = async (req, res) => {
  const { id } = req.params;

  // validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid channel id"
    });
  }

  const channel = await Channel.findById(id).populate(
    "owner",
    "name email avatar"
  );

  if (!channel) {
    return res.status(404).json({
      status: "fail",
      message: "Channel not found"
    });
  }

  res.status(200).json({
    status: "success",
    channel
  });
};