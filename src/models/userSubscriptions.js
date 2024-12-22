const mongoose = require("mongoose");

// Define Subscription Schema
const schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appUser", // Reference to the 'User' model
      required: true, // Ensure that the user_id is provided
    },
    subscriptions_name: {
      type: String,
      required: true,
      trim: true, // removes whitespace from both ends of a string
    },
    max_order_per_day: {
      type: Number, // Changed to Number
      required: true,
    },
    subscriptions_validity: {
      type: String,
      required: true,
      trim: true,
    },
    subscriptions_price: {
      type: Number, // Changed to Number
      required: true,
    },
    subscriptions_start_date: {
      type: Date, // Changed to Date type
      required: true,
    },
    subscriptions_end_date: {
      type: Date, // Changed to Date type
      required: true,
    },
    is_subscriptions_active: {
      type: Boolean, // Changed to Boolean
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create Subscription model
const userSubscription = mongoose.model("userSubscription", schema);

module.exports = userSubscription;
