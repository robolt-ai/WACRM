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
  userSignUp,
  userSignIn,
  verifyOtpSignUp,
  resendVerifyOtpSignUp,
  myAccount,
  forgotUserPassword,
  verifyForgotOtp,
  changePassword,
  resetPassword,
} = require("../controllers/User/user");

//----------------------------user API---------------------------------
//router.post("/user-signUp", validateUserSignUp, userSignUp);
router.post("/user-signIn", userSignIn);
router.post(
  "/signUp-verfiy-otp",
  validateVerifyOtpSent,
  authMiddleware,
  verifyOtpSignUp
);
router.post("/forgot-password", validateForgotUserPassword, forgotUserPassword);
router.post(
  "/verify-forgot-password-otp",
  validateVerifyForgotOtp,
  authMiddleware,
  verifyForgotOtp
);
router.post("/update-password", authMiddleware, changePassword);
router.post("/resend-otp", authMiddleware, resendVerifyOtpSignUp);
// router.get("/my-account", authMiddleware, myAccount);
router.post("/reset-password", authMiddleware, resetPassword);
//---------------------------------user API end ---------------------------------

// Catch-all route for handling 404
router.all("*", async (req, res) => {
  let time = new Date();
  let Data = `${time}`;
  res.status(404).json({ status: false, message: "Page not found", Data });
});

module.exports = router;
