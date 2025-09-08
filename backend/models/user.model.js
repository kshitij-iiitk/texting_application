import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.isGoogleUser; // Password not required for Google users
    },
    minlength: 6,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "not-specified"],
  },
  ProfilePic: {
    type: String,
    default: "",
  },
  // New fields for Google OAuth
  email: {
    type: String,
    sparse: true, // Allows multiple null values, but unique non-null values
    unique: true,
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Pre-save middleware to handle profile pic for Google users
userSchema.pre('save', function(next) {
  if (this.isGoogleUser && !this.ProfilePic) {
    // If it's a Google user without a profile pic, keep the default avatar system
    this.ProfilePic = `https://avatar.iran.liara.run/public/${
      this.gender === "male" ? "boy" : this.gender === "female" ? "girl" : "boy"
    }?username=${this.userName}`;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;