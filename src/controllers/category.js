

const jwt = require("jsonwebtoken");
const Category = require("../models/category");

exports.createCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    console.log(req.body)
    
    req.body.user_id = userId;

    let isCategory = await Category.create(req.body);

    if (!isCategory) {
      return res.status(404).send({
        status: false,
        message: "Category has not created someting went wrong",
      });
    }

    return res.status(201).send({
      status: true,
      message: "Category has been created successfully",
      data: isCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allCategory = await Category
      .find({ })
      .sort({ createdAt: -1 });

    if (!allCategory) {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Category has been fetched successfully",
      data: allCategory,
    });
  } catch (e) {
    console.log(e);
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allCategory = await Category.findOneAndDelete({
      _id: req.params.id,
    });
    if (!allCategory) {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Category has been deleted successfully",
      data: allCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getCategoryDetailsOrUpdate = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.category_type == "getCategory") {
      let isCategory = await Category.findOne({
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
      let isCategory = await Category.findOneAndUpdate(
        { _id: req.params.id, user_id: userId },
        { $set: { category_name: req.body.category_name } },
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