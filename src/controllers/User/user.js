const bcrypt = require("bcrypt");
const { sendEmail, sendEmailforget } = require("../../util/sendEmail");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/user");
const userSignUp = async function (req, res) {
  try {
    let userEmail = "ak5913755@gmail.com";
    let userPassword = "Aman@123#";
    const existingUser = await userModel.findOne({
      userEmail: userEmail.toLowerCase(),
      isVerified: true,
    });

    if (existingUser) {
      return console.log(
        "This email address is already registered. Please log in."
      );
    } else {
      const salt = await bcrypt.genSalt(12);
      const hashedPass = await bcrypt.hash(userPassword, salt);

      const newUser = {
        userEmail: userEmail.toLowerCase(),
        userPassword: hashedPass,
        isVerified: true,
      };

      const createdUser = await userModel.create(newUser);

      const token = jwt.sign(
        {
          userId: createdUser._id,
        },
        "jwt_key_!@#$"
      );

      console.log(
        "Sign-up successful! Please check your email for an OTP to verify your account."
      );
    }
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.userEmail === 1
    ) {
      console.error("Email already exists.");
      return res
        .status(400)
        .send({ status: false, message: "Email already exists." });
    } else {
      console.error(error.message);
      return res.status(500).send({ status: false, message: error.message });
    }
  }
};

userSignUp();

exports.userSignIn = async function (req, res) {
  try {
    let data = req.body;
   
    let { userEmail, userPassword } = data;

    if (!userPassword) {
      return res.status(400).send({
        status: false,
        message: "Password is required",
      });
    }

  // Check if the user exists
  const user = await userModel.findOne({ userEmail: userEmail.toLowerCase() });

  if (!user) {
    return res.status(404).send({
      status: false,
      message: "Please enter correct email or password",
    });
  }

  if (!user.userPassword) {
    return res.status(500).send({
      status: false,
      message: "User password is not set in the database",
    });
  }

  let isMatch = await bcrypt.compare(userPassword, user.userPassword);

    if (!isMatch) {
      return res.status(404).send({
        status: false,
        message: "Please enter correct email or password",
      });
    }

    const userId = user._id;

    const token = jwt.sign({ userId }, "jwt_key_!@#$");

    res.setHeader("authorization", token);
    res.cookie("token", token);

   
    return res.status(200).send({
      status: true,
      message: "Login successful",
      data: { user, token },
    });
    
  } catch (Err) {
    console.log(Err);
    res.status(500).send({ status: false, message: Err.message });
  }
};

exports.verifyOtpSignUp = async function (req, res) {
  try {
    let { otp } = req.body;

    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const decoded = jwt.verify(token, "jwt_key_!@#$");

    let userId = await userModel.findOne({ _id: decoded.userId });
    let compared = await bcrypt.compare(otp, userId.otp);

    if (!compared) {
      return res.status(404).send({ status: false, message: "Wrong OTP" });
    }

    await userModel.findOneAndUpdate(
      { _id: decoded.userId },
      { $set: { isVerified: true, updatedAt: new Date() } },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Email verified please login" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.resendVerifyOtpSignUp = async function (req, res) {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const decoded = jwt.verify(token, "jwt_key_!@#$");

    let userId = await userModel.findOne({ _id: decoded.userId });

    console.log(userId);

    if (userId) {
      // return res.status(400).send({ status: false, message: "your Email id is not verified please verify your Email id" })

      let otpCode = Math.floor(100000 + Math.random() * 900000);

      let otp = String(otpCode);

      // let otp = "000000"

      await sendEmail(userId.userEmail, "Resend Send Verify Email", otp);

      const salt = await bcrypt.genSalt(12);

      const hashedOtp = await bcrypt.hash(otp, salt);

      // data.OTP = hashedOtp

      let userEmailId = await userModel.findOneAndUpdate(
        { userEmail: userId.userEmail },
        { otp: hashedOtp },
        { new: true }
      );

      console.log(userEmailId);

      let token = jwt.sign(
        {
          userId: userEmailId._id,
        },
        "jwt_key_!@#$"
      );

      res.cookie("token", token);

      return res.status(201).send({
        status: true,
        message: "Verify OTP Resend Successfull",
        token,
      });
    }

    // return res.status(200).send({ status: true, message: "User email is verified!" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.userlist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    let user = await userModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    if (user) {
      return res.status(200).send({ status: true, data: user });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.forgotUserPassword = async function (req, res) {
  try {
    const { userEmail } = req.body;

    const checkEmail = await userModel.findOne({ userEmail: userEmail });

    if (!checkEmail) {
      return res.status(400).json({
        status: false,
        message: "Email does not exist. Please enter a valid email address.",
      });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const otp = String(otpCode);

    await sendEmailforget(userEmail, "Password Reset Verification", otp);

    const salt = await bcrypt.genSalt(12);
    const hashedOtp = await bcrypt.hash(otp, salt);

    const updatedUser = await userModel.findOneAndUpdate(
      { userEmail: userEmail },
      { otp: hashedOtp },
      { new: true }
    );

    const token = jwt.sign(
      {
        userId: updatedUser._id,
      },
      "jwt_key_!@#$"
    );

    res.cookie("token", token);

    return res.status(200).json({
      status: true,
      message:
        "OTP generated successfully. Please check your email and verify.",
      token: token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.verifyForgotOtp = async function (req, res) {
  try {
    const { otp } = req.body;

    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    const savedUser = await userModel.findOne({ _id: userId });

    const isOtpCorrect = await bcrypt.compare(otp, savedUser.otp);

    if (!isOtpCorrect) {
      return res.status(404).json({ status: false, message: "Incorrect OTP" });
    }

    await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { isVerified: true } },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "OTP is verified! You can now proceed with the password reset.",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
// exports.changePassword = async function (req, res) {
//   try {
//     const { password, confirmPassword } = req.body;

//     const token =
//       req.body.token ||
//       req.query.token ||
//       (req.headers.authorization && req.headers.authorization.split(" ")[1]);

//     const decoded = jwt.verify(token, "jwt_key_!@#$");

//     const loggedInUser = await userModel.findOne({ _id: decoded.userId });

//     const userWithSameEmail = await userModel.findOne({
//       userEmail: loggedInUser.userEmail,
//     });

//     const isSamePassword = await bcrypt.compare(
//       password,
//       userWithSameEmail.userPassword
//     );

//     if (isSamePassword) {
//       return res.status(400).json({
//         status: false,
//         message:
//           "You can't set your current password as the new password. Please choose a different one.",
//       });
//     }

//     const salt = await bcrypt.genSalt(12);
//     const hashedPass = await bcrypt.hash(password, salt);

//     const updatedUser = await userModel.findOneAndUpdate(
//       { _id: userWithSameEmail._id },
//       { $set: { userPassword: hashedPass } },
//       { new: true }
//     );

//     return res.status(200).json({
//       status: true,
//       message: "Password successfully updated.",
//       data: updatedUser,
//     });
//   } catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

exports.resetPassword = async function (req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const { userId } = jwt.verify(token, "jwt_key_!@#$");

    const user = await userModel.findOne({ _id: userId });

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.userPassword
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message:
          "The provided current password does not match your actual current password.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "New password and confirmed password do not match.",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { userPassword: hashedNewPassword } },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Password updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.changePassword = async function (req, res) {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const token =
      req.body.token ||
      req.query.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    const decoded = jwt.verify(token, "jwt_key_!@#$");

    const loggedInUser = await userModel.findOne({ _id: decoded.userId });

    const isSamePassword = await bcrypt.compare(
      oldPassword,
      loggedInUser.userPassword
    );

    if (!isSamePassword) {
      return res.status(400).json({
        status: false,
        message:
          "You can't set your current password as the new password. Please choose a different one.",
      });
    }

    const salt = await bcrypt.genSalt(12);

    const hashedPass = await bcrypt.hash(newPassword, salt);

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: loggedInUser._id },
      { $set: { userPassword: hashedPass } },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Password successfully updated.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
