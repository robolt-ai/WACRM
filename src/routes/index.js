const express = require("express");
const router = express.Router();

const auth = require("./auth");
const category = require("./category");
const subscriptions = require("./subscriptions");
const order = require("./order");
const users = require("./users");


router.use("/auth", auth);
router.use("/category", category);
router.use("/subscriptions", subscriptions);
router.use("/order", order);
router.use("/users", users);

module.exports = router;
