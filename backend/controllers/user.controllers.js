import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
        try {
                const userId = req.user._id;
                const users = await User.find({ _id: { $ne: userId } }).select("-password"); // Exclude password and version field
                res.status(200).json(users);
        } catch (error) {
                console.error("Error fetching user for sidebar:", error.message);
                return res.status(500).json({ error: "Internal server error" });
                
        }
}