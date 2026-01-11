import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* RANDOM AVATAR LIST */
const avatarList = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=10",
];

const getRandomAvatar = () =>
  avatarList[Math.floor(Math.random() * avatarList.length)];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, select: false },

    avatar: {
      type: String,
      default: getRandomAvatar, // assign random avatar if none provided
    },

    subscribers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* HASH PASSWORD */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});
/* PASSWORD VALIDATION */
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
