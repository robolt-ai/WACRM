const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getMemberShipUser,
  getMemberShipReport,
  updateMemberShip,
} = require("../controllers/membership");

router.get("/get-member-ship-user", authMiddleware, getMemberShipUser);
router.post("/membership-generate-report", authMiddleware, getMemberShipReport);
router.post("/update-member-ship/:id", authMiddleware, updateMemberShip);
module.exports = router;
