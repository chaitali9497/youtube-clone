import mongoose from "mongoose";

/* RANDOM CHANNEL AVATARS */
const avatarList = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
];

const getRandomAvatar = () =>
  avatarList[Math.floor(Math.random() * avatarList.length)];

const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    description: String,

    banner: {
      type: String,
      default: "https://picsum.photos/1200/300",
    },

    avatar: {
      type: String,
      default: getRandomAvatar,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscribers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
