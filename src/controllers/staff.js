const jwt = require("jsonwebtoken");
const Staff = require("../models/staff");
exports.createStaff = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    req.body.admin_userId = userId;

    let isStaff = await Staff.create(req.body);

    if (!isStaff) {
      return res.status(404).send({
        status: false,
        message: "Staff has not created someting went wrong",
      });
    }

    return res.status(201).send({
      status: true,
      message: "Staff has been created successfully",
      data: isStaff,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getStaff = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.query.limit && req.query.page) {
      let limit = parseInt(req.query.limit);
      let page = parseInt(req.query.page);
      let skip = limit * (page - 1);
      let allStaff = await Staff.find({ admin_userId: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const totalPages = Math.ceil(
        (await Staff.countDocuments({ admin_userId: userId })) / limit
      );

      if (!allStaff) {
        return res.status(404).send({
          status: false,
          message: "Staff not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Staff has been fetched successfully",
        data: allStaff,
        totalPages,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.getStaffDetailsOrUpdate = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.staff_type == "delete") {
      let isStaff = await Staff.findOneAndDelete({
        _id: req.params.id,
        admin_userId: userId,
      });
      if (!isStaff) {
        return res.status(404).send({
          status: false,
          message: "Staff not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Staff has been deleted successfully",
        data: isStaff,
      });
    } else if (req.body.staff_type == "getStaffDetails") {
      let isStaff = await Staff.findOne({
        admin_userId: userId,
        _id: req.params.id,
      });
      if (!isStaff) {
        return res.status(404).send({
          status: false,
          message: "Staff not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Staff has been fetched successfully",
        data: isStaff,
      });
    } else {
      let isStaff = await Staff.findOneAndUpdate(
        { _id: req.params.id, admin_userId: userId },
        {
          $set: {
            staff_name: req.body.staff_name,
            // staff_email: req.body.staff_email,
            staff_address: req.body.staff_address,
            // staff_gender: req.body.staff_gender,
            staff_join_date: req.body.staff_join_date,
            staff_phone_no: req.body.staff_phone_no,
          },
        },
        { new: true }
      );
      if (!isStaff) {
        return res.status(404).send({
          status: false,
          message: "Staff not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Staff has been updated successfully",
        data: isStaff,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
