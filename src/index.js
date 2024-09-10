const express = require("express");
require("dotenv/config");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
// const multer = require("multer");
const viewPage = require("./routes/viewPage");
require("./config/db"); // Import the Mongoose instance from db.js

const router = require("./routes");

// Use body-parser middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

const session = require("express-session");

app.use(
  session({
    secret: "secret-key-@##@123",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(logger("dev"));
app.use(cors());

app.use(bodyParser.json());
var cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use("/api/v1", router);

viewPage(app);

const port = process.env.PORT || 3000;

app.listen(
  port,
  console.log(`🚀🚀 Server running on port http://localhost:${port}`)
);
