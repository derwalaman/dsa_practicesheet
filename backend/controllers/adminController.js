import Admins from "../models/Admins.js";

export const loginAdmin = async (req, res) => {
    try {
        const { adminId, password } = req.body;
        console.log("Admin login attempt:", { adminId, password });

        if (!adminId || !password) {
            return res.status(400).json({ message: "Admin ID and password are required" });
        }

        const admin = await Admins.findOne({ adminId });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if( admin.password !== password ) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Optional: Create and send token/session here

        res.status(200).json({ message: "Admin authenticated successfully" });
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Server error" });
    }
};
