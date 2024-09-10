let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const staffSchema = new mongoose.Schema(
  {
    admin_userId: {
      type: ObjectId,
      ref: "User",
    },
    staff_name: {
      type: String,
      required: true,
      trim: true,
    },
    // staff_email: {
    //   type: String,
    //   trim: true,
    // },
    staff_address: {
      type: String,
      trim: true,
    },
    // staff_gender: {
    //   type: String,
    //   enum: ["Male", "Female"],
    //   default: "Male",
    // },
    staff_phone_no: {
      type: String,
      required: true,
      trim: true,
    },
    staff_join_date: {
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
    is_paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Staff", staffSchema);
