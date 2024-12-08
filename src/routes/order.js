const express = require("express");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { getOrder, deleteOrder, getOrderDetailsOrUpdate, createOrder } = require("../controllers/order");
const router = express.Router();


router.get("/get-order", getOrder);
router.delete("/delete-order/:id", deleteOrder);
// router.get("/get-order-details/:id", getOrderDetailsOrUpdate);
router.post("/create-order", createOrder);
// router.get("/get-total-sales", getTotalSales);
router.post(
  "/get-or-update-order/:id",
  // authMiddleware,
  getOrderDetailsOrUpdate
);
// Catch-all route for handling 404
router.all("*", async (req, res) => {
  let time = new Date();
  let Data = `${time}`;
  res.status(404).json({ status: false, message: "Page not found", Data });
});

module.exports = router;
