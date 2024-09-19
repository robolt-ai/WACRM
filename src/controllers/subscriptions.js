

const jwt = require("jsonwebtoken");
const Subscriptions = require("../models/subscriptions");

exports.createSubscriptions = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    req.body.user_id = userId;

    let isSubscriptions = await Subscriptions.create(req.body);

    if (!isSubscriptions) {
      return res.status(404).send({
        status: false,
        message: "Subscriptions has not created someting went wrong",
      });
    }

    return res.status(201).send({
      status: true,
      message: "Subscriptions has been created successfully",
      data: isSubscriptions,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getAllSubscriptions  = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allSubscriptions  = await Subscriptions
      .find({ })
      .sort({ createdAt: -1 });

    if (!allSubscriptions ) {
      return res.status(404).send({
        status: false,
        message: "Subscriptions not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Subscriptions has been fetched successfully",
      data: allSubscriptions ,
    });
  } catch (e) {
    console.log(e);
  }
};


exports.deleteSubscriptions = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allSubscriptions = await Subscriptions.findOneAndDelete({
      _id: req.params.id,
    });
    if (!allSubscriptions) {
      return res.status(404).send({
        status: false,
        message: "Subscriptions not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Subscriptions has been deleted successfully",
      data: allSubscriptions,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getSubscriptionsDetailsOrUpdate = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.category_type == "getCategory") {
      let isSubscriptions = await Subscriptions.findOne({
        _id: req.params.id,
      });
      if (!isSubscriptions) {
        return res.status(404).send({
          status: false,
          message: "Subscriptions not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Subscriptions has been fetched successfully",
        data: isSubscriptions,
      });
    } else {
      let isSubscriptions = await Subscriptions.findOneAndUpdate(
        { _id: req.params.id, user_id: userId },
        { $set: { category_name: req.body.category_name } },
        { new: true }
      );
      if (!isSubscriptions) {
        return res.status(404).send({
          status: false,
          message: "Subscriptions not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Subscriptions has been updated successfully",
        data: isSubscriptions,
      });
    }
  } catch (e) {
    console.log(e);
  }
};