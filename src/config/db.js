const mongoose = require("mongoose");

// MongoDB connection URL
const dbUrl = `mongodb+srv://thinkinternet2020:FlrUonevplMlfTXx@cluster0.bgydh5k.mongodb.net/WACRM?retryWrites=true&w=majority`;

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
