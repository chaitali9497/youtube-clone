import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const seedChannels = async () => {
  await Channel.deleteMany();

  const users = await User.find();

  const channels = users.map(user => ({
    name: user.name,
    description: `${user.name} official channel`,
    avatar: "https://i.pravatar.cc/150",
    banner: "",
    owner: user._id,
    subscribers: Math.floor(Math.random() * 2000000)
  }));

  await Channel.insertMany(channels);

  console.log("✅ Channels seeded");
  process.exit();
};

seedChannels();
