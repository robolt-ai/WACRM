const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createIncomeCategory,
  getAllIncomeCategory,
  deleteIncomeCategory,
  getIncomeCategoryDetails,
  getIncomeCategoryDetailsOrUpdate,
} = require("../controllers/income-category");

router.get("/get-income-category", getAllIncomeCategory);
router.delete("/delete-income-category/:id", deleteIncomeCategory);
router.get("/get-income-category-details/:id", getIncomeCategoryDetails);
router.post("/create-income-category", createIncomeCategory);
// router.get("/get-total-sales", getTotalSales);
router.post(
  "/get-or-update-income-category/:id",
  authMiddleware,
  getIncomeCategoryDetailsOrUpdate
);

module.exports = router;
