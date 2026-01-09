import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

dotenv.config();
await connectDB();

const seedVideos = async () => {
  await Video.deleteMany();

  const channels = await Channel.find();

  const videoData = [
    {
      title: "React JS Full Course 2024",
      thumbnail: "https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg"
    },
    {
      title: "Build YouTube Clone Using React",
      thumbnail: "https://i.ytimg.com/vi/FHTbsZEJspU/maxresdefault.jpg"
    },
    {
      title: "Node.js & Express Crash Course",
      thumbnail: "https://i.ytimg.com/vi/fBNz5xF-Kx4/maxresdefault.jpg"
    },
    {
      title: "MongoDB Tutorial for Beginners",
      thumbnail: "https://i.ytimg.com/vi/ofme2o29ngU/maxresdefault.jpg"
    }
    
  ];

  const videos = Array.from({ length: 20 }).map((_, i) => {
    const channel = channels[i % channels.length];

    return {
      title: videoData[i % videoData.length].title + ` #${i + 1}`,
      description: "Auto seeded video description",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: videoData[i % videoData.length].thumbnail,
      channel: channel._id,
      views: Math.floor(Math.random() * 2000000)
    };
  });

  await Video.insertMany(videos);

  console.log(" 20 Videos seeded");
  process.exit();
};

seedVideos();
