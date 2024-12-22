const jwt = require("jsonwebtoken");

module.exports = function (viewPage) {
  function isUserAllowed(req, res, next) {
    const token = req.cookies.token;
    const isAuthenticated = req.session.isAuthenticated;

    if (!token && !isAuthenticated) {
      console.log("No token and not authenticated");
      return res.redirect("/login");
    }

    if (token) {
      jwt.verify(token, "jwt_key_!@#$", (err, user) => {
        if (err || !user) {
          return res.redirect("/login");
          // return res.redirect("/Home")
        }
        req.user = user;
        req.session.isAuthenticated = true;
        return next();
      });
    } else {
      // User is already authenticated, redirect to home page
      return res.redirect("/");
    }
  }

  viewPage.get("/home", function (req, res) {
    res.render("Auth/home");
  });

  viewPage.get("/login", function (req, res) {
    res.render("Auth/login");
  });

  viewPage.get("/referral/:id", function (req, res) {
    res.render("Auth/register");
  });

  viewPage.get("/register", function (req, res) {
    res.render("Auth/register");
  });

  viewPage.get("/verify-otp-signup", function (req, res) {
    res.render("Auth/verify-otp-signup");
  });

  viewPage.get("/verify-otp-forget-password", function (req, res) {
    res.render("Auth/verify-otp-forget-password");
  });

  viewPage.get("/reset-password", function (req, res) {
    res.render("Auth/reset-password");
  });

  viewPage.get("/forget-password", function (req, res) {
    res.render("Auth/forget-password");
  });

  viewPage.get("/", isUserAllowed, function (req, res) {
    res.render("Dashboard/index");
  });

  viewPage.get("/reset-password-page", isUserAllowed, function (req, res) {
    res.render("Dashboard/reset-password-page");
  });

  //subscriptions
  viewPage.get("/subscriptions", isUserAllowed, function (req, res) {
    res.render("Dashboard/subscriptions");
  });

  viewPage.get("/users", isUserAllowed, function (req, res) {
    res.render("Dashboard/users");
  });
  viewPage.get("/orders", isUserAllowed, function (req, res) {
    res.render("Dashboard/orders");
  });
  viewPage.get("/category", isUserAllowed, function (req, res) {
    res.render("Dashboard/category");
  });
  viewPage.get("/category", isUserAllowed, function (req, res) {
    res.render("Dashboard/category");
  });

  viewPage.get("/pending", isUserAllowed, function (req, res) {
    res.render("Dashboard/Myorder/pending");
  });
  viewPage.get("/packed", isUserAllowed, function (req, res) {
    res.render("Dashboard/Myorder/packed");
  });
  viewPage.get("/out_for_delivery", isUserAllowed, function (req, res) {
    res.render("Dashboard/Myorder/out_for_delivery");
  });
  viewPage.get("/delivered", isUserAllowed, function (req, res) {
    res.render("Dashboard/Myorder/delivered");
  });
  viewPage.get("/rejected_order", isUserAllowed, function (req, res) {
    res.render("Dashboard/Myorder/rejectedOrder");
  });


  /////////////////////////////////////////////////////////

  viewPage.get("/logout", function (req, res) {
    // Delete token from client-side
    res.clearCookie("token");

    // Delete token from server-side
    res.clearCookie("connect.sid");
    res.render("Auth/login");
  });

  viewPage.get("*", function (req, res) {
    res.render("page-note-found");
  });
};
