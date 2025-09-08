import bcryptjs from "bcryptjs";

import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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


//Google Auth

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body; // Google ID token from frontend
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId });
    
    if (!user) {
      // Check if user exists with this email (for account linking)
      user = await User.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.ProfilePic = user.ProfilePic || picture; // Keep existing profile pic if available
        await user.save();
      } else {
        // Create new user with Google data
        const userName = email.split('@')[0] + '_' + Date.now(); // Generate unique username
        
        user = new User({
          fullName: name,
          userName,
          email,
          googleId,
          ProfilePic: picture,
          password: null, // No password for Google users
          gender: "not-specified", // Default gender for Google users
          isGoogleUser: true, // Flag to identify Google users
        });
        
        await user.save();
      }
    }
    
    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);
    
    res.status(200).json({
      message: "Google authentication successful",
      _id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      ProfilePic: user.ProfilePic,
      isGoogleUser: user.isGoogleUser || false,
    });
    
  } catch (error) {
    console.log("Error in Google auth:", error.message);
    res.status(500).json({ error: "Google authentication failed" });
  }
};