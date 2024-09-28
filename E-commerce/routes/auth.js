const express = require("express");

const { signupValidator, loginValidator } = require("../utils/validators/auth");

const {
  signup,
  login,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require("../services/auth");

const router = express.Router();

router.post("/signup", signupValidator, signup);

router.post("/login", loginValidator, login);

router.post("/forget_password", forgetPassword);

router.post("/verify_password_code", verifyPasswordResetCode);

router.post("/reset_password", resetPassword);

module.exports = router;
