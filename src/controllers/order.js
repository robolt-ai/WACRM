

const jwt = require("jsonwebtoken");
const Order = require("../models/order");

exports.createOrder = async (req, res) => {
  try {
    // const token =
    //   req.body.token ||
    //   req.query.token ||
    //   (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    // const { userId } = jwt.verify(token, "jwt_key_!@#$");

    // console.log(req.body)
    
    // req.body.user_id = userId;

    console.log(req.body)

    let isOrder = await Order.create({
      customer_name: req.body.name,
      customer_email: "johndoe@example.com",
      customer_contact: req.body.MobileNumber,
      customer_address: req.body.UserAddress,
      order_type: req.body.categoryselect,
      order_date: new Date(),
      order_amount: "100.50",
      order_status: "pending"
    }
    );

    if (!isOrder) {
      return res.status(404).send({
        status: false,
        message: "Order has not created someting went wrong",
      });
    }

    return res.status(201).send({
      status: true,
      message: "Order has been created successfully",
      data: isOrder,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getOrder = async (req, res) => {
  try {
    // const token =
    //   req.body.token ||
    //   req.query.token ||
    //   (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    // const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allCategory = await Order
      .find({ })
      .sort({ createdAt: -1 });

    if (!allCategory) {
      return res.status(404).send({
        status: false,
        message: "Order not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Order has been fetched successfully",
      data: allCategory,
    });
  } catch (e) {
    console.log(e);
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    // const token =
    //   req.body.token ||
    //   req.query.token ||
    //   (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    // const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allCategory = await Order.findOneAndDelete({
      _id: req.params.id,
    });
    if (!allCategory) {
      return res.status(404).send({
        status: false,
        message: "Order not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Order has been deleted successfully",
      data: allCategory,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getOrderDetailsOrUpdate = async (req, res) => {
  try {
    // const token =
    //   req.body.token ||
    //   req.query.token ||
    //   (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    // const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.type == "getOrder") {
      let isOrder = await Order.findOne({
        _id: req.params.id,
      });
      if (!isOrder) {
        return res.status(404).send({
          status: false,
          message: "Order not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Order has been fetched successfully",
        data: isOrder,
      });
    } else {
      let isOrder = await Order.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (!isOrder) {
        return res.status(404).send({
          status: false,
          message: "Order not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Order has been updated successfully",
        data: isOrder,
      });
    }
  } catch (e) {
    console.log(e);
  }
};