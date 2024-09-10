let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const expenseCategorySchema = new mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "User",
    },
    ex_category_name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense-category", expenseCategorySchema);
