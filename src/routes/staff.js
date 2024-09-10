const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getStaff,
  createStaff,
  getStaffDetailsOrUpdate,
} = require("../controllers/staff");
router.get("/get-staff", authMiddleware, getStaff);
router.post("/create-staff", authMiddleware, createStaff);
router.post(
  "/get-delete-or-update-staff/:id",
  authMiddleware,
  getStaffDetailsOrUpdate
);
module.exports = router;
