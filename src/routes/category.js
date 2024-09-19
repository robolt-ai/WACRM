const express = require("express");
const { getAllCategory, getCategoryDetailsOrUpdate, createCategory, deleteCategory } = require("../controllers/category");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();


router.get("/get-category", getAllCategory);
router.delete("/delete-category/:id", deleteCategory);
router.get("/get--category-details/:id", getCategoryDetailsOrUpdate);
router.post("/create-category", createCategory);
// router.get("/get-total-sales", getTotalSales);
router.post(
  "/get-or-update-category/:id",
  authMiddleware,
  getCategoryDetailsOrUpdate
);
// Catch-all route for handling 404
router.all("*", async (req, res) => {
  let time = new Date();
  let Data = `${time}`;
  res.status(404).json({ status: false, message: "Page not found", Data });
});

module.exports = router;
