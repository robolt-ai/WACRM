const Income = require("../models/income");
const jwt = require("jsonwebtoken");
const staff = require("../models/staff");

exports.createIncome = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    req.body.user_id = userId;
    let isIncome = await Income.create(req.body);

    if (!isIncome) {
      return res.status(404).send({
        status: false,
        message: "Income has not created someting went wrong",
      });
    }

    return res.status(201).send({
      status: true,
      message: "Income has been created successfully",
      data: isIncome,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getAllIncome = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allIncome = await Income.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .populate(["income_type"]);

    if (!allIncome) {
      return res.status(404).send({
        status: false,
        message: "Income not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Income has been fetched successfully",
      data: allIncome,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getIncomeDetails = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allIncome = await Income.findOne({
      user_id: userId,
      _id: req.params.id,
    });
    if (!allIncome) {
      return res.status(404).send({
        status: false,
        message: "Income not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Income has been fetched successfully",
      data: allIncome,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allIncome = await Income.findOneAndDelete({
      user_id: userId,
      _id: req.params.id,
    });
    if (!allIncome) {
      return res.status(404).send({
        status: false,
        message: "Income not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Income has been deleted successfully",
      data: allIncome,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getIncomeDetailsOrUpdate = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.Income_type == "getIncome") {
      let isIncome = await Income.findOne({
        user_id: userId,
        _id: req.params.id,
      }).populate(["income_type"]);
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
    } else {
      let isIncome = await Income.findOneAndUpdate(
        { _id: req.params.id, user_id: userId },
        {
          $set: {
            income_type: req.body.income_type,
            income_amount: req.body.income_amount,
            income_description: req.body.income_description,
            income_date: req.body.income_date,
          },
        },
        { new: true }
      );
      if (!isIncome) {
        return res.status(404).send({
          status: false,
          message: "Income not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Income has been updated successfully",
        data: isIncome,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.getTotalExpanseTotalIncomeTotalCustomer = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    const totalIncome = await Income.find({
      user_id: userId,
    });
    //need add Income income_amount

    let totalIncomeAmount = 0;
    totalIncome.forEach((element) => {
      totalIncomeAmount += element.income_amount;
    });

    const totalCustomer = await staff.find({
      user_id: userId,
    });

    return res.status(200).send({
      status: true,
      message: "Total Income, Total Customer",
      data: {
        totalIncomeAmount,
        totalCustomer: totalCustomer.length,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getIncomeReport = async (req, res) => {
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

exports.searchIncomeFilter = async (req, res) => {
  try {
    const searchPattern = req.query.pattern;
    console.log(searchPattern);

    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (searchPattern) {
      let allIncome = await Income.find({
        user_id: userId,
        income_type: searchPattern,
      })
        .sort({ createdAt: -1 })
        .populate(["income_type"]);

      if (!allIncome) {
        return res.status(404).send({
          status: false,
          message: "Income not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: `${searchPattern} Income has fetched successfully`,
        data: allIncome,
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
