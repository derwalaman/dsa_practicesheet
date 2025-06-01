import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  companies: {
    type: [String],
    default: [],
  },
  revision: {
    type: Boolean,
    default: false,
  },
  platform: {
    type: [String],
    default: [],
  },
  platformLink: {
    type: [String],
    default: [],
  },
  description: { type: String, required: true },
  example: { type: String },
  explanation: { type: String },
  answerCode: { type: String },
  note: { type: Boolean, default: false },
  noteText: { type: String },
});

export default mongoose.model("Questions", questionSchema);
