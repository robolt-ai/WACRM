const express = require("express");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { getAllSubscriptions, deleteSubscriptions, getSubscriptionsDetailsOrUpdate, createSubscriptions } = require("../controllers/subscriptions");
const router = express.Router();


router.get("/get-subscriptions", getAllSubscriptions);
router.delete("/delete-subscriptions/:id", deleteSubscriptions);
router.get("/get-subscriptions-details/:id", getSubscriptionsDetailsOrUpdate);
router.post("/create-subscriptions", createSubscriptions);
// router.get("/get-total-sales", getTotalSales);
router.post(
  "/get-or-update-subscriptions/:id",
  authMiddleware,
  getSubscriptionsDetailsOrUpdate
);
// Catch-all route for handling 404
router.all("*", async (req, res) => {
  let time = new Date();
  let Data = `${time}`;
  res.status(404).json({ status: false, message: "Page not found", Data });
});

module.exports = router;
