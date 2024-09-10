const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getAllExpense,
  deleteExpense,
  getExpenseDetails,
  createExpense,
  getExpenseDetailsOrUpdate,
  getTotalExpanseTotalIncomeTotalCustomer,
  getExpenseReport,
  searchExpenseFilter,
} = require("../controllers/expense");

router.get("/get-expense", getAllExpense);
router.delete("/delete-expense/:id", deleteExpense);
router.get("/get-expense-category/:id", getExpenseDetails);
router.post("/create-expense", createExpense);
// router.get("/get-total-sales", getTotalSales);
router.post(
  "/get-or-update-expense/:id",
  authMiddleware,
  getExpenseDetailsOrUpdate
);
router.get(
  "/get-total-expense-or-income-or-customer",
  authMiddleware,
  getTotalExpanseTotalIncomeTotalCustomer
);
router.post("/expense-generate-report", authMiddleware, getExpenseReport);

router.get("/get-expense-category-filter", authMiddleware, searchExpenseFilter);
module.exports = router;
