import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    adminId: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Admins", adminSchema);
