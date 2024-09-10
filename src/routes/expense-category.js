const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createExpenseCategory,
  getAllExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategoryDetails,
  getExpenseCategoryDetailsOrUpdate,
} = require("../controllers/expense-category");

router.get("/get-expense-category", getAllExpenseCategory);
router.delete("/delete-expense-category/:id", deleteExpenseCategory);
router.get("/get-expense-category-details/:id", getExpenseCategoryDetails);
router.post("/create-expense-category", createExpenseCategory);
// router.get("/get-total-sales", getTotalSales);
router.post(
  "/get-or-update-expense-category/:id",
  authMiddleware,
  getExpenseCategoryDetailsOrUpdate
);

module.exports = router;
