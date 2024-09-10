const jwt = require("jsonwebtoken");
const user = require("../models/user");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access denied. No token provided.",
      });
    }

    let { userId } = jwt.verify(token, "jwt_key_!@#$");

    let isUser = await user.findOne({ _id: userId });

    if (!isUser) {
      res.clearCookie("token");

      // Delete token from server-side
      res.clearCookie("connect.sid");

      return res.status(401).json({
        status: false,
        message: "Access denied. Invalid token.",
      });
    }

    if (isUser.account_hold_status) {
      res.clearCookie("token");

      // Delete token from server-side
      res.clearCookie("connect.sid");

      return res.status(401).json({
        status: false,
        message: "Access denied. Invalid token.",
      });
    }

    next();
  } catch (error) {
    let errorMessage;

    if (error.name === "TokenExpiredError") {
      errorMessage = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid token";
    } else {
      errorMessage =
        error.message || "An error occurred during authentication.";
    }

    return res.status(401).json({
      status: false,
      message: errorMessage,
    });
  }
};
