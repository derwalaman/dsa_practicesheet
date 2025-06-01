import mongoose from "mongoose";
import dotenv from "dotenv";
import Questions from "../models/Questions.js";

dotenv.config();

const MONGO_URI = "mongodb+srv://amanderwal02:Derwal%40150205@cluster0.ubpiqur.mongodb.net/dsa?retryWrites=true&w=majority&appName=Cluster0";

const seedQuestions = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "dsa" });

    // Clear previous data
    await Questions.deleteMany();

    // await Questions.insertMany(questions);
    console.log("✅ Sample questions inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedQuestions();
