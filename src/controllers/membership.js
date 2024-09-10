const Income = require("../models/income");
const jwt = require("jsonwebtoken");
const staff = require("../models/staff");
const membership = require("../models/membership");

exports.getMemberShipUser = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    // Update every month on the 1st date
    const currentDate = new Date();
    const isFirstOfMonth = currentDate.getDate() === 1;

    console.log(isFirstOfMonth);

    if (isFirstOfMonth) {
      const staffMembersToUpdate = await staff.find({
        admin_userId: userId,
        is_paid: true,
      });

      if (staffMembersToUpdate.length > 0) {
        const promises = staffMembersToUpdate.map(async (item) => {
          // Update each staff member
          const updatedStaff = await staff.findOneAndUpdate(
            { admin_userId: userId, _id: item._id },
            { is_paid: false }, // Change to true if they are supposed to be paid
            { new: true }
          );

          await membership.findOneAndUpdate({
            this_month_paid_amount: 0,
          });

          return updatedStaff;
        });

        // Wait for all updates to complete
        const updatedStaffMembers = await Promise.all(promises);

        console.log("Updated staff members:");
      } else {
        console.log("No staff members to update.");
      }
    }

    if (req.query.limit && req.query.page && req.query.is_paid_false) {
      let limit = parseInt(req.query.limit);
      let page = parseInt(req.query.page);
      let skip = limit * (page - 1);
      let allStaff = await staff
        .find({ admin_userId: userId, is_paid: false })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const totalPages = Math.ceil(
        (await staff.countDocuments({ admin_userId: userId, is_paid: false })) /
          limit
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

    if (req.query.limit && req.query.page && req.query.is_paid_true) {
      let limit = parseInt(req.query.limit);
      let page = parseInt(req.query.page);
      let skip = limit * (page - 1);
      let allStaff = await staff
        .find({ admin_userId: userId, is_paid: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const totalPages = Math.ceil(
        (await staff.countDocuments({ admin_userId: userId, is_paid: true })) /
          limit
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

exports.updateMemberShip = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let isMembership = await staff.findOneAndUpdate(
      {
        admin_userId: userId,
        _id: req.params.id,
      },
      { is_paid: true },
      {
        new: true,
      }
    );
    if (!isMembership) {
      return res.status(404).send({
        status: false,
        message: "Membership not found",
      });
    }

    // this_month_paid_amount: {
    //   type: Number,
    //   trim: true,
    // },
    //neeed to update

    let isMember = await membership.findOneAndUpdate({
      admin_userId: userId,
      $inc: { this_month_paid_amount: 100 },
    });
    if (!isMember) {
      await membership.create({
        this_month_paid_amount: 100,
        admin_userId: userId,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Member ship has been updated successfully",
      data: isMembership,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getMemberShipReport = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.report_type == "income") {
      let isIncome = await Income.find({
        user_id: userId,
        income_date: { $gte: req.body.fromDate, $lte: req.body.toDate },
      })
        .sort({ createdAt: -1 })
        .populate(["income_type"]);

      if (!isIncome) {
        return res.status(404).send({
          status: false,
          message: "Income not found",
        });
      }
      return res.status(200).send({
        status: true,
        message: "Income has been fetched successfully",
        data: isIncome,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};
