import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const seedComments = async () => {
  await Comment.deleteMany();

  const videos = await Video.find();
  const users = await User.find();

  const comments = [];

  videos.forEach(video => {
    for (let i = 0; i < 3; i++) {
      const user = users[Math.floor(Math.random() * users.length)];

      comments.push({
        text: "🔥 This video is amazing!",
        video: video._id,
        user: user._id
      });
    }
  });

  await Comment.insertMany(comments);

  console.log("Comments seeded");
  process.exit();
};

seedComments();
