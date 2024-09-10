const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true, // removes whitespace from both ends of a string
    },
    userName: {
      type: String,

      trim: true,
    },
    userPassword: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Basic", "Superadmin"],
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;
