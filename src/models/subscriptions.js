const mongoose = require("mongoose");

// Define User Schema
const schema = new mongoose.Schema(
  {
    subscriptions_name: {
      type: String,
      required: true,
      trim: true, // removes whitespace from both ends of a string
    },
    subscriptions_type: {
      type: String,
      required: true,
      trim: true,
    },
    subscriptions_validity: {
      type: String,
      required: true,
      trim: true,
    },
    subscriptions_price: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create User model
const Subscription = mongoose.model("subscriptions", schema);

module.exports = Subscription;
