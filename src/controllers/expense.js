const expense = require("../models/expense");
const jwt = require("jsonwebtoken");
const staff = require("../models/staff");
const income = require("../models/income");
const membership = require("../models/membership");

exports.createExpense = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    req.body.user_id = userId;
    let isExpense = await expense.create(req.body);

    if (!isExpense) {
      return res.status(404).send({
        status: false,
        message: "Expense has not created someting went wrong",
      });
    }

    return res.status(201).send({
      status: true,
      message: "Expense has been created successfully",
      data: isExpense,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getAllExpense = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allExpense = await expense
      .find({ user_id: userId })
      .sort({ createdAt: -1 })
      .populate(["ex_type"]);

    if (!allExpense) {
      return res.status(404).send({
        status: false,
        message: "Expense not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Expense has been fetched successfully",
      data: allExpense,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getExpenseDetails = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allExpense = await expense.findOne({
      user_id: userId,
      _id: req.params.id,
    });
    if (!allExpense) {
      return res.status(404).send({
        status: false,
        message: "Expense not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Expense has been fetched successfully",
      data: allExpense,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    let allExpense = await expense.findOneAndDelete({
      user_id: userId,
      _id: req.params.id,
    });
    if (!allExpense) {
      return res.status(404).send({
        status: false,
        message: "Expense not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Expense has been deleted successfully",
      data: allExpense,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getExpenseDetailsOrUpdate = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.expense_type == "getExpense") {
      let isExpense = await expense
        .findOne({ user_id: userId, _id: req.params.id })
        .populate(["ex_type"]);
      if (!isExpense) {
        return res.status(404).send({
          status: false,
          message: "Expense not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Expense has been fetched successfully",
        data: isExpense,
      });
    } else {
      let isExpense = await expense.findOneAndUpdate(
        { _id: req.params.id, user_id: userId },
        {
          $set: {
            ex_type: req.body.ex_type,
            ex_amount: req.body.ex_amount,
            ex_description: req.body.ex_description,
            ex_date: req.body.ex_date,
          },
        },
        { new: true }
      );
      if (!isExpense) {
        return res.status(404).send({
          status: false,
          message: "Expense not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: "Expense has been updated successfully",
        data: isExpense,
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

    const totalExpense = await expense.find({
      user_id: userId,
    });
    //need add expense ex_amount

    let totalExpenseAmount = 0;
    totalExpense.forEach((element) => {
      totalExpenseAmount += element.ex_amount;
    });

    const totalIncome = await income.find({
      user_id: userId,
    });

    let totalIncomeAmount = 0;
    totalIncome.forEach((element) => {
      totalIncomeAmount += element.income_amount;
    });

    const totalCustomer = await staff.find({
      admin_userId: userId,
    });

    let totalMummyExpense = 0;
    const totalExpenseMummy = await expense.find({
      user_id: userId,
      ex_type: "659b8298e0ba2f1ea590cf48",
    });

    totalExpenseMummy.forEach((element) => {
      totalMummyExpense += element.ex_amount;
    });

    let totalAnkushExpense = 0;
    const totalExpensAnkush = await expense.find({
      user_id: userId,
      ex_type: "65a274c9516329b781b27e27",
    });

    totalExpensAnkush.forEach((element) => {
      totalAnkushExpense += element.ex_amount;
    });
    // console.log(totalAnkushExpense);

    let totalOtherExpense = 0;
    const totalExpensOther = await expense.find({
      user_id: userId,
      ex_type: "659b85c38795c89442b5029d",
    });

    totalExpensOther.forEach((element) => {
      totalOtherExpense += element.ex_amount;
    });

    let totalHomeGrocery = 0;
    const totalHomeGrocerys = await expense.find({
      user_id: userId,
      ex_type: "659b83975651af8ba22930e6",
    });

    totalHomeGrocerys.forEach((element) => {
      totalHomeGrocery += element.ex_amount;
    });

    let papaTotalIncome = 0;
    const totalIncomePapa = await income.find({
      user_id: userId,
      income_type: "659b83582f60d6a8ffe2c2fa",
    });
    totalIncomePapa.forEach((element) => {
      papaTotalIncome += element.income_amount;
    });

    let totalOtherIncome = 0;
    const totalIncomeOther = await income.find({
      user_id: userId,
      income_type: "659b85258795c89442b50279",
    });
    totalIncomeOther.forEach((element) => {
      totalOtherIncome += element.income_amount;
    });

    let totalMySalaryIncome = 0;
    const totalIncomeMySalary = await income.find({
      user_id: userId,
      income_type: "65bed7ef267da03bea27ca64",
    });
    totalIncomeMySalary.forEach((element) => {
      totalMySalaryIncome += element.income_amount;
    });

    return res.status(200).send({
      status: true,
      message: "Total Expense, Total Income, Total Customer",
      data: {
        totalExpenseAmount,
        totalIncomeAmount,
        totalCustomer: totalCustomer.length,
        totalMummyExpense,
        papaTotalIncome,
        totalHomeGrocery,
        totalAnkushExpense,
        totalOtherExpense,
        totalOtherIncome,
        totalMySalaryIncome,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getExpenseReport = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (req.body.report_type == "expense") {
      let isExpense = await expense
        .find({
          user_id: userId,
          ex_date: { $gte: req.body.fromDate, $lte: req.body.toDate },
        })
        .sort({ createdAt: -1 })
        .populate(["ex_type"]);

      if (!isExpense) {
        return res.status(404).send({
          status: false,
          message: "Expense not found",
        });
      }
      return res.status(200).send({
        status: true,
        message: "Expense has been fetched successfully",
        data: isExpense,
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

exports.searchExpenseFilter = async (req, res) => {
  try {
    const searchPattern = req.query.pattern;

    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    if (searchPattern) {
      let allExpense = await expense
        .find({ user_id: userId, ex_type: searchPattern })
        .sort({ createdAt: -1 })
        .populate(["ex_type"]);

      if (!allExpense) {
        return res.status(404).send({
          status: false,
          message: "Expense not found",
        });
      }

      return res.status(200).send({
        status: true,
        message: `${searchPattern} Expense has fetched successfully`,
        data: allExpense,
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
