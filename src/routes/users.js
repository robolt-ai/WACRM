const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  validateUserSignUp,
  validateUserSignIn,
  validateVerifyOtpSent,
  validateChangePassword,
  validateForgotUserPassword,
  validateVerifyForgotOtp,
} = require("../middlewares/userValidator");

const {
  userlist,
} = require("../controllers/User/user");

//----------------------------user API---------------------------------
//router.post("/user-signUp", validateUserSignUp, userSignUp);
router.get("/user-list", userlist);


// Catch-all route for handling 404
router.all("*", async (req, res) => {
  let time = new Date();
  let Data = `${time}`;
  res.status(404).json({ status: false, message: "Page not found", Data });
});

module.exports = router;
