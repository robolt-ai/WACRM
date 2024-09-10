let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const incomeCategorySchema = new mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "User",
    },
    income_category_name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Income-category", incomeCategorySchema);
