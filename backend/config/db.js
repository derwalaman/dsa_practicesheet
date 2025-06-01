import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://amanderwal02:Derwal%40150205@cluster0.ubpiqur.mongodb.net/dsa?retryWrites=true&w=majority&appName=Cluster0`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected to 'dsa' database");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
