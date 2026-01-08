import Channel from "../models/Channel.js";
import checkRequiredFields from "../utils/requiredFields.js";
import AppError from "../utils/AppError.js";

/* ================= CREATE CHANNEL ================= */
export const createChannel = async (req, res, next) => {
  const { name, description, avatar, banner } = req.body;
  const userId = req.user._id;

  //  validate required fields
  const missingFields = checkRequiredFields({ name });
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(", ")}`, 400)
    );
  }

  //  user already has a channel
  const existingChannel = await Channel.findOne({ owner: userId });
  if (existingChannel) {
    return next(new AppError("User already has a channel", 400));
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
