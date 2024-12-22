
const jwt = require("jsonwebtoken");
const Subscriptions = require("../models/subscriptions");
const appUser = require("../models/appUser");
const userSubscription = require("../models/userSubscriptions");
const moment = require('moment'); // Ensure you have moment.js installed for date calculations


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



exports.createUserSubscriptions = async (req, res) => {
  try {
    // Check if user exists
    const isAppUser = await appUser.findOne({ _id: req.body.user_id });

    if (!isAppUser) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    // Check if there is already an active subscription for the user
    const isActiveSubscription = await userSubscription.findOne({ user_id: req.body.user_id });

    if (isActiveSubscription) {
      return res.status(400).send({
        status: false,
        message: "Subscription already active",
      });
    }

    // Fetch subscription details using the provided subscription_id
    const subscription = await subscription.findOne({ _id: req.body.subscription_id });

    if (!subscription) {
      return res.status(404).send({
        status: false,
        message: "Subscription plan not found",
      });
    }

    // Calculate subscriptions_end_date based on subscriptions_validity
    const subscriptions_start_date = new Date();
    const subscriptions_end_date = calculateEndDate(subscriptions_start_date, Number(subscription.subscriptions_validity));

    // Create a new user subscription
    const newSubscription = await userSubscription.create({
      user_id: req.body.user_id,
      subscriptions_name: subscription.subscriptions_name,
      max_order_per_day: Number(subscription.max_order_per_day),
      subscriptions_validity: Number(subscription.subscriptions_validity),
      subscriptions_price: Number(subscription.subscriptions_price),
      subscriptions_start_date: subscriptions_start_date,
      subscriptions_end_date: subscriptions_end_date,
      is_subscriptions_active: true,
    });

    if (!newSubscription) {
      return res.status(500).send({
        status: false,
        message: "Subscription creation failed. Something went wrong.",
      });
    }

    // Return success response
    return res.status(201).send({
      status: true,
      message: "Subscription has been created successfully",
      data: newSubscription,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: false,
      message: "An error occurred while creating the subscription.",
    });
  }
};

// Utility function to calculate the end date based on validity (in days)
function calculateEndDate(startDate, validityInDays) {
  // Use moment.js to add days to the start date and return the calculated end date
  return moment(startDate).add(validityInDays, 'days').toDate();
}





