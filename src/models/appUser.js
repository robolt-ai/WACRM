const mongoose = require("mongoose");

// Define User Schema
const schema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
    //   required: true,
      trim: true, // removes whitespace from both ends of a string
    },
    customer_email: {
      type: String,
    //   required: true,
      trim: true,
    },
    customer_contact: {
      type: String,
    //   required: true,
      trim: true,
    },
    customer_address: {
      type: String,
    //   required: true,
      trim: true,
    },
    
    Join_date: {
      type: String,
    //   required: true,
    default: new Date(),
      trim: true,
    },
    subscription_amount: {
      type: String,
    //   required: true,
      trim: true,
    },
    is_subscription: {
      type: Boolean,
    //   required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create User model
const appuser = mongoose.model("Appuser", schema);

module.exports = appuser;
