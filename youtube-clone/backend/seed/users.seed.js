import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();
await connectDB();

const seedUsers = async () => {
  await User.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  const users = await User.insertMany([
    {
      name: "Code With Harry",
      email: "harry@test.com",
      password
    },
    {
      name: "JavaScript Mastery",
      email: "js@test.com",
      password
    },
    {
      name: "Traversy Media",
      email: "traversy@test.com",
      password
    },
    {
      name: "freeCodeCamp",
      email: "fcc@test.com",
      password
    },
    {
      name: "Akshay Saini",
      email: "akshay@test.com",
      password
    }
  ]);

  console.log(" Users seeded");
  process.exit();
};

seedUsers();
