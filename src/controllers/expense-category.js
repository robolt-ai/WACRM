const expense = require("../models/expense");
const expenseCategory = require("../models/expense-category");
const jwt = require("jsonwebtoken");

exports.createExpenseCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    req.body.user_id = userId;

    let isExpenseCategory = await expenseCategory.create(req.body);

    if (!isExpenseCategory) {
      return res.status(404).send({
        status: false,
        message: "ExpenseCategory has not created someting went wrong",
      });
    }

    return res.status(201).send({
      status: true,
      message: "ExpenseCategory has been created successfully",
      data: isExpenseCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getAllExpenseCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allExpenseCategory = await expenseCategory
      .find({ user_id: userId })
      .sort({ createdAt: -1 });

    if (!allExpenseCategory) {
      return res.status(404).send({
        status: false,
        message: "ExpenseCategory not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "ExpenseCategory has been fetched successfully",
      data: allExpenseCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getExpenseCategoryDetails = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allExpenseCategory = await expenseCategory.findOne({
      user_id: userId,
      _id: req.params.id,
    });
    if (!allExpenseCategory) {
      return res.status(404).send({
        status: false,
        message: "ExpenseCategory not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "ExpenseCategory has been fetched successfully",
      data: allExpenseCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.deleteExpenseCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (await expense.findOne({ user_id: userId, ex_type: req.params.id })) {
      return res.status(404).send({
        status: false,
        message: "ExpenseCategory is in use",
      });
    }
    let allExpenseCategory = await expenseCategory.findOneAndDelete({
      user_id: userId,
      _id: req.params.id,
    });
    if (!allExpenseCategory) {
      return res.status(404).send({
        status: false,
        message: "ExpenseCategory not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "ExpenseCategory has been deleted successfully",
      data: allExpenseCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getExpenseCategoryDetailsOrUpdate = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.category_type == "getCategory") {
      let isCategory = await expenseCategory.findOne({
        user_id: userId,
        _id: req.params.id,
      });
      if (!isCategory) {
        return res.status(404).send({
          status: false,
          message: "Category not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Category has been fetched successfully",
        data: isCategory,
      });
    } else {
      let isCategory = await expenseCategory.findOneAndUpdate(
        { _id: req.params.id, user_id: userId },
        { $set: { ex_category_name: req.body.ex_category_name } },
        { new: true }
      );
      if (!isCategory) {
        return res.status(404).send({
          status: false,
          message: "Category not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Category has been updated successfully",
        data: isCategory,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
