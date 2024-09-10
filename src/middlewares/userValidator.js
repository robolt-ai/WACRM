//* validators/register.validator.js
const Joi = require("joi")

//Sign Up
exports.validateUserSignUp = (req, res, next) => {
  const schema = Joi.object({
    role: Joi.string().optional(),
    userName: Joi.string().required().messages({
      "any.required": "Username is required",
    }),
    userEmail: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    userContact: Joi.string().length(10).optional().allow(""),
    userPassword: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-__+.]).{8,}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
    // confirmPassword: Joi.string()
    //   .valid(Joi.ref('userPassword'))
    //   .required()
    //   .messages({
    //     'any.only': 'Passwords do not match',
    //     'any.required': 'Confirm Password is required',
    //   }),
  })

  const { error } = schema.validate(req.body)
  if (error) {
    const errorMessage = error.details[0].message.replace(/['"]+/g, "")
    return res.status(400).json({ status: false, message: errorMessage })
  }
  next()
}

//Sign In
exports.validateUserSignIn = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().allow("").optional(),
    token: Joi.string().allow("").optional(),
    userEmail: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    userPassword: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-__+.]).{8,}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    const errorMessage = error.details[0].message.replace(/['"]+/g, "")
    return res.status(400).json({ status: false, message: errorMessage })
  }

  next()
}

// Verifying OTP for forgot password
exports.validateVerifyOtpSent = (req, res, next) => {
  const verifyForgotOtpSchema = Joi.object({
    userId: Joi.string().allow("").optional(),
    otp: Joi.string().min(6).required().messages({
      "string.min": "OTP must be at least 6 characters long",
      "any.required": "OTP is required",
    }),
    token: Joi.string().allow("").optional(),
  })

  const { error } = verifyForgotOtpSchema.validate(req.body)

  if (error) {
    const errorMessage = error.details[0].message.replace(/['"]+/g, "")
    return res.status(400).json({ message: errorMessage })
  }

  next()
}

// Verifying user Email for forgot password
exports.validateForgotUserPassword = (req, res, next) => {
  const userForgetPasswordSchema = Joi.object({
    userId: Joi.string().allow("").optional(),
    userEmail: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
  })

  const { error } = userForgetPasswordSchema.validate(req.body)

  if (error) {
    const errorMessage = error.details[0].message.replace(/['"]+/g, "")
    return res.status(400).json({ message: errorMessage })
  }

  next()
}

// Verifying OTP for forgot password
exports.validateVerifyForgotOtp = (req, res, next) => {
  const verifyForgotOtpSchema = Joi.object({
    userId: Joi.string().allow("").optional(),
    otp: Joi.string().min(6).required().messages({
      "string.min": "OTP must be at least 6 characters long",
      "any.required": "OTP is required",
    }),
    token: Joi.string().allow("").optional(),
  })

  const { error } = verifyForgotOtpSchema.validate(req.body)

  if (error) {
    const errorMessage = error.details[0].message.replace(/['"]+/g, "")
    return res.status(400).json({ message: errorMessage })
  }

  next()
}

// Change Password validator
exports.validateChangePassword = (req, res, next) => {
  const changePasswordSchema = Joi.object({
    userId: Joi.string().allow("").optional(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-__+.]).{8,}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Confirm Password is required",
      }),
    token: Joi.string().allow("").optional(),
  })

  const { error } = changePasswordSchema.validate(req.body)

  if (error) {
    const errorMessage = error.details[0].message.replace(/['"]+/g, "")
    return res.status(400).json({ message: errorMessage })
  }

  next()
}
