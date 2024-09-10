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

  //Expense
  viewPage.get("/expense-list", isUserAllowed, function (req, res) {
    res.render("Dashboard/Expense/expense-list");
  });

  viewPage.get("/expense-category-list", isUserAllowed, function (req, res) {
    res.render("Dashboard/Expense/expense-category-list");
  });

  //Income
  viewPage.get("/income-list", isUserAllowed, function (req, res) {
    res.render("Dashboard/Income/income-list");
  });

  viewPage.get("/income-category-list", isUserAllowed, function (req, res) {
    res.render("Dashboard/Income/income-category-list");
  });

  //Employee

  //Staff

  viewPage.get("/staff-list", isUserAllowed, function (req, res) {
    res.render("Dashboard/Staff management/staff-list");
  });

  viewPage.get("/user-group-list", isUserAllowed, function (req, res) {
    res.render("Dashboard/Staff management/user-group-list");
  });

  viewPage.get("/user-group-list", isUserAllowed, function (req, res) {
    res.render("Dashboard/Staff management/create-user-group");
  });

  viewPage.get("/member-list-paid", isUserAllowed, function (req, res) {
    res.render("Dashboard/Member ship/member-list-paid");
  });
  viewPage.get("/member-list-unpaid", isUserAllowed, function (req, res) {
    res.render("Dashboard/Member ship/member-list-unpaid");
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
