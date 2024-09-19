const express = require("express");
const router = express.Router();

const auth = require("./auth");
const category = require("./category");
const subscriptions = require("./subscriptions");


router.use("/auth", auth);
router.use("/category", category);
router.use("/subscriptions", subscriptions);

module.exports = router;
