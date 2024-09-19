const mongoose = require("mongoose");

// Define User Schema
const schema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      trim: true, // removes whitespace from both ends of a string
    },
  },
  {
    timestamps: true,
  }
);

// Create User model
const category = mongoose.model("category", schema);

module.exports = category;
