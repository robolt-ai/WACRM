const mongoose = require("mongoose");

// Define User Schema
const memberShipSchema = new mongoose.Schema(
  {
    this_month_paid_amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create User model
module.exports = mongoose.model("Membership", memberShipSchema);
