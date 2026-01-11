import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

//  Absolute path fix (Windows-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

// DEBUG (temporary)
console.log("MONGO_URI FOUND:", !!process.env.MONGO_URI);
const avatarList = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
];

const randomAvatar = () =>
  avatarList[Math.floor(Math.random() * avatarList.length)];

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(" MongoDB connected");

  const users = await User.find({ avatar: "" });

  for (const user of users) {
    user.avatar = randomAvatar();
    await user.save();
  }

  console.log(" Existing users updated with avatars");
  process.exit(0);
};

run().catch(err => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
