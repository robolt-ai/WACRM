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
    order_type: {
      type: String,
    //   required: true,
      trim: true,
    },
    order_date: {
      type: String,
    //   required: true,
    default: new Date(),
      trim: true,
    },
    order_amount: {
      type: String,
    //   required: true,
      trim: true,
    },
    order_status: {
      type: String,
    //   required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create User model
const order = mongoose.model("order", schema);

module.exports = order;
