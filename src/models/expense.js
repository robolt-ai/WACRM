const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const expenseSchema = new mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "User",
    },
    ex_type: {
      type: ObjectId,
      ref: "Expense-category",
    },
    ex_amount: {
      type: Number,
      required: true,
      trim: true,
    },
    ex_description: {
      type: String,
      trim: true,
    },
    ex_date: {
      type: String, // Store date as a string
      set: function (value) {
        // Convert the incoming date string to the desired format "YYYY-MM-DD"
        if (value instanceof Date) {
          const year = value.getFullYear();
          const month = String(value.getMonth() + 1).padStart(2, "0");
          const day = String(value.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return value;
      },
      default: () => {
        // Set the default date to the current date in the desired format
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      },
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
