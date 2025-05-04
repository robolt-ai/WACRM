const mongoose = require("mongoose");

// MongoDB connection URL
const dbUrl = `#mongoURL Here`;

mongoose.set("strictQuery", true);

// MongoDB connection options
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose
  .connect(dbUrl, dbOptions)
  .then(() => {
    console.log("🍏🍏 Connected to MongoDB 🍏🍏");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Export the Mongoose instance to use in other parts of the application
module.exports = mongoose;
