import bcryptjs from "bcryptjs";

import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the incoming data

    const { fullName, userName, password, confirmPassword, gender } = req.body;

    console.log("Extracted userName:", userName); // Check if userName is properly extracted

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ userName });
    console.log("Existing user found:", user); // Check if user already exists

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const ProfilePic = `https://avatar.iran.liara.run/public/${
      gender == "male" ? "boy" : "girl"
    }?username=${userName}`;

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      gender,
      ProfilePic,
    });

    if (newUser) {
       generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: "User registered successfully",
        _id: newUser._id,
        userName: newUser.userName,
        fullName: newUser.fullName,
        ProfilePic: newUser.ProfilePic,
      });
      console.log("User has been created successfully");
    }
  } catch (error) {
    console.log("Error in signup:", error.message);
   
  }
};

export const login = async (req, res) => {
  try {
    const {userName, password} = req.body;
    const user = await User.findOne({ userName });
    const IsPasswordCorrect = await bcryptjs.compare(password, user?.password|| " ");
    if (!user || !IsPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
      _id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      ProfilePic: user.ProfilePic,
    });

  } catch (error) {
    console.log("Error in login:", error.message);
    res.status(500).json({ error: "Internal server error" });
    
  }
};

export const logout = async (req, res) => {
 try {
  res.cookie("jwt","",{maxAge:0})
  res.status(200).json({ message: "User logged out successfully" });
 } catch (error) {
  res.status(500).json({ error: "Internal server error" });
  console.log("Error in logout:", error.message);
 }
};
