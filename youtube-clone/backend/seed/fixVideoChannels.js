import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Video from "../models/Video.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(" MongoDB connected");

  // pick first user as channel owner
  const user = await User.findOne();
  if (!user) throw new Error("No users found");

  const result = await Video.updateMany(
    { channel: null },
    { channel: user._id }
  );

  console.log(` Updated ${result.modifiedCount} videos`);
  process.exit(0);
};

run().catch(err => {
  console.error(" Error:", err.message);
  process.exit(1);
});
