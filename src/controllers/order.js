

const jwt = require("jsonwebtoken");
const Order = require("../models/order");
const axios = require('axios');
const appUser = require("../models/appUser");


exports.createOrder = async (req, res) => {
  try {
    // const token =
    //   req.body.token ||
    //   req.query.token ||
    //   (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    // const { userId } = jwt.verify(token, "jwt_key_!@#$");

    // console.log(req.body)
    
    // req.body.user_id = userId;

    
   let isUser =  await appUser.findOne({ customer_contact: req.body.MobileNumber});

   let isOrderLimit = await Order.find({customer_contact: req.body.MobileNumber});

   if(isOrderLimit > 2 && isUser.is_subscription == false){

    const apiPayload = {
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWJhODk0YTMzMzVmMGI3MGU5ZjliNCIsIm5hbWUiOiJMb2NhbCBEZWxpdmVyeSA5OSIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NmViYTg5M2EzMzM1ZjBiNzBlOWY5YWQiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTczMDAwODQ4NH0.FN2PqWYaoIUVJv3VbhPNkPUj74-9r8k1zYx8zKHLqkM",
      campaignName: "Subscription limit reached",
      destination: isUser.customer_contact || "919030197878",
      userName: isUser.customer_name || "Default User",
      templateParams: isUser.templateParams || [],
      source: isUser.source || "API update",
      media: isUser.media || {},
      buttons: isUser.buttons || [],
      carouselCards: isUser.carouselCards || [],
      location: isUser.location || {},
      paramsFallbackValue: isUser.paramsFallbackValue || {},
    };

    // Make the Axios API call
    try {
      const apiResponse = await axios.post(
        "https://backend.aisensy.com/campaign/t1/api/v2",
        apiPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("External API response:", apiResponse.data);
    } catch (apiError) {
      console.error("Error calling external API:", apiError.message);
      // Optionally, return an error to the client or log for later debugging
      return res.status(500).send({
        status: false,
        message: "Order updated but failed to call external API.",
        error: apiError.message,
      });
    }


     return res.status(404).send({
       status: false,
       message: "You have reached your order limit",
     });

   }
  

    let isOrder = await Order.create({
      customer_name: req.body.name,
      customer_email: "johndoe@example.com",
      customer_contact: req.body.MobileNumber,
      customer_address: req.body.UserAddress,
      order_type: req.body.categoryselect,
      order_cart: req.body.usercart,
      order_date: new Date(),
      order_amount: null,
      order_status: "pending"
    }
    );

    if (!isOrder) {
      return res.status(404).send({
        status: false,
        message: "Order has not created someting went wrong",
      });
    }


   if(!isUser){
     await appUser.create({
       customer_name: req.body.name,
       customer_email: "johndoe@example.com",
       customer_contact: req.body.MobileNumber,
       customer_address: req.body.UserAddress,
       Join_date: new Date(),
       is_subscription: false,
     })
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
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    
    let allCategory = await Order
    .find()
    .skip((page - 1) * limit)
    .limit(limit).sort({ createdAt: -1 });

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

// exports.getOrderDetailsOrUpdate = async (req, res) => {
//   try {
//     // const token =
//     //   req.body.token ||
//     //   req.query.token ||
//     //   (req.headers.authorization && req.headers.authorization.split(" ")[1]);

//     // const { userId } = jwt.verify(token, "jwt_key_!@#$");

//     if (req.body.type == "getOrder") {
//       let isOrder = await Order.findOne({
//         _id: req.params.id,
//       });
//       if (!isOrder) {
//         return res.status(404).send({
//           status: false,
//           message: "Order not found",
//         });
//       }

//       return res.status(200).send({
//         status: true,
//         message: "Order has been fetched successfully",
//         data: isOrder,
//       });
//     } else {

      
//       let isOrder = await Order.findOneAndUpdate(
//         { _id: req.params.id },
//         { $set: req.body },
//         { new: true }
//       );
//       if (!isOrder) {
//         return res.status(404).send({
//           status: false,
//           message: "Order not found",
//         });
//       }

//       return res.status(200).send({
//         status: true,
//         message: "Order has been updated successfully",
//         data: isOrder,
//       });
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };



exports.getOrderDetailsOrUpdate = async (req, res) => {
  try {
    // const { type } = req.body;

    // if (!type || !['getOrder', 'updateOrder'].includes(type)) {
    //   return res.status(400).send({
    //     status: false,
    //     message: "Invalid request type. Must be 'getOrder' or 'updateOrder'.",
    //   });
    // }

    const orderId = req.params.id;

    if (!orderId) {
      return res.status(400).send({
        status: false,
        message: "Order ID is required.",
      });
    }

    if (req.body.type == "getOrder") {
      // Fetch order details
      const order = await Order.findOne({ _id: orderId });
      if (!order) {
        return res.status(404).send({
          status: false,
          message: "Order not found.",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Order fetched successfully.",
        data: order,
      });
    } else {
      // Update order details
      const updates = req.body;
      const order = await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: updates },
        { new: true }
      );

      if (!order) {
        return res.status(404).send({
          status: false,
          message: "Order not found.",
        });
      }

  

      // ["pending", "packed" , "out_for_delivery", "delivered"]

      let campaignName = updates.order_status == "packed" ? "packed" : updates.order_status == "out_for_delivery" ? "Out for delivery" : updates.order_status == "delivered" ? "delivered" : updates.order_status == "order_rejected" ? "Order Rejected" : updates.order_status == "order_approved" ? "order approved" : "defaultCampaign";

      console.log(campaignName)

      // Prepare Axios data payload
      const apiPayload = {
        apiKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWJhODk0YTMzMzVmMGI3MGU5ZjliNCIsIm5hbWUiOiJMb2NhbCBEZWxpdmVyeSA5OSIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NmViYTg5M2EzMzM1ZjBiNzBlOWY5YWQiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTczMDAwODQ4NH0.FN2PqWYaoIUVJv3VbhPNkPUj74-9r8k1zYx8zKHLqkM",
        campaignName: campaignName || "defaultCampaign",
        destination: order.customer_contact || "919030197878",
        userName: order.customer_name || "Default User",
        templateParams: updates.templateParams || [],
        source: updates.source || "API update",
        media: updates.media || {},
        buttons: updates.buttons || [],
        carouselCards: updates.carouselCards || [],
        location: updates.location || {},
        paramsFallbackValue: updates.paramsFallbackValue || {},
      };

      // Make the Axios API call
      try {
        const apiResponse = await axios.post(
          "https://backend.aisensy.com/campaign/t1/api/v2",
          apiPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("External API response:", apiResponse.data);
      } catch (apiError) {
        console.error("Error calling external API:", apiError.message);
        // Optionally, return an error to the client or log for later debugging
        return res.status(500).send({
          status: false,
          message: "Order updated but failed to call external API.",
          error: apiError.message,
        });
      }

      return res.status(200).send({
        status: true,
        message: "Order updated successfully and external API notified.",
        data: order,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
