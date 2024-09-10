const express = require("express");
const router = express.Router();

const auth = require("./auth");
const expense_category = require("./expense-category");
const expense = require("./expense");
const staff = require("./staff");
const income = require("./income");
const income_category = require("./income-category");
const membership = require("./membership");

router.use("/auth", auth);
router.use("/expense-category", expense_category);
router.use("/expense", expense);
router.use("/staff", staff);
router.use("/income", income);
router.use("/income-category", income_category);
router.use("/membership", membership);

module.exports = router;
