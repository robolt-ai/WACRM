const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getAllIncome,
  deleteIncome,
  getIncomeDetails,
  createIncome,
  getIncomeDetailsOrUpdate,
  getTotalExpanseTotalIncomeTotalCustomer,
  getIncomeReport,
  searchIncomeFilter,
} = require("../controllers/income");

router.get("/get-income", getAllIncome);
router.delete("/delete-income/:id", deleteIncome);
router.get("/get-income-category/:id", getIncomeDetails);
router.post("/create-income", createIncome);
// router.get("/get-total-sales", getTotalSales);
router.post(
  "/get-or-update-income/:id",
  authMiddleware,
  getIncomeDetailsOrUpdate
);
router.get(
  "/get-total-income-or-income-or-customer",
  authMiddleware,
  getTotalExpanseTotalIncomeTotalCustomer
);
router.post("/income-generate-report", authMiddleware, getIncomeReport);

router.get("/get-income-category-filter", authMiddleware, searchIncomeFilter);

module.exports = router;
