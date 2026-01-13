import User from "../models/User.js";
import jwt from "jsonwebtoken";
import checkRequiredFields from "../utils/requiredFields.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check missing fields
  const missingFields = checkRequiredFields({ name, email, password });

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "fail",
      message: `Missing fields: ${missingFields.join(", ")}`
    });
  }
   if (password.length < 6) {
    return res.status(400).json({
      status: "fail",
      message: "Password must be at least 6 characters"
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      status: "fail",
      message: "User already exists"
    });
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    }
  });
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  //check missing fields
  const missingFields = checkRequiredFields({ email, password });

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "fail",
      message: `Missing fields: ${missingFields.join(", ")}`
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password"
    });
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    }
  });
};
const channel = await Channel.findOne({ owner: user._id });

res.status(200).json({
  user: {
    ...user._doc,
    channel: channel
      ? {
          _id: channel._id,
          name: channel.name,
          avatar: channel.avatar
        }
      : null
  },
  token
});

