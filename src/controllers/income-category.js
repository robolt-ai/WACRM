const income = require("../models/income");
const IncomeCategory = require("../models/income-category");
const jwt = require("jsonwebtoken");

exports.createIncomeCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    req.body.user_id = userId;

    let isIncomeCategory = await IncomeCategory.create(req.body);

    if (!isIncomeCategory) {
      return res.status(404).send({
        status: false,
        message: "IncomeCategory has not created someting went wrong",
      });
    }

    return res.status(201).send({
      status: true,
      message: "IncomeCategory has been created successfully",
      data: isIncomeCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getAllIncomeCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allIncomeCategory = await IncomeCategory.find({ user_id: userId }).sort(
      { createdAt: -1 }
    );

    if (!allIncomeCategory) {
      return res.status(404).send({
        status: false,
        message: "IncomeCategory not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "IncomeCategory has been fetched successfully",
      data: allIncomeCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getIncomeCategoryDetails = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allIncomeCategory = await IncomeCategory.findOne({
      user_id: userId,
      _id: req.params.id,
    });
    if (!allIncomeCategory) {
      return res.status(404).send({
        status: false,
        message: "IncomeCategory not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "IncomeCategory has been fetched successfully",
      data: allIncomeCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.deleteIncomeCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (await income.findOne({ user_id: userId, income_type: req.params.id })) {
      return res.status(404).send({
        status: false,
        message: "IncomeCategory is in use",
      });
    }
    let allIncomeCategory = await IncomeCategory.findOneAndDelete({
      user_id: userId,
      _id: req.params.id,
    });
    if (!allIncomeCategory) {
      return res.status(404).send({
        status: false,
        message: "IncomeCategory not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "IncomeCategory has been deleted successfully",
      data: allIncomeCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getIncomeCategoryDetailsOrUpdate = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.category_type == "getCategory") {
      let isCategory = await IncomeCategory.findOne({
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
      let isCategory = await IncomeCategory.findOneAndUpdate(
        { _id: req.params.id, user_id: userId },
        { $set: { income_category_name: req.body.income_category_name } },
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
