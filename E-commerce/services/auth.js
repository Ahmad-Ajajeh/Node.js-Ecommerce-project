const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const { sanitizeUser } = require("../utils/sanitize");

const generateToken = require("../utils/generateToken");

// @dsec Singup
// @route Get /api/auth/signup
// @access Public

exports.signup = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = generateToken({ userId: user._id });

  res.status(201).json({ data: user, token });
});

// @desc Login
// @route Get /api/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("INCORRECT E-MAIL OR PASSWORD", 401));
  }

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) {
    return next(new ApiError("INCORRECT E-MAIL OR PASSWORD", 401));
  }

  const token = generateToken({ userId: user._id });

  res.status(200).json({ data: sanitizeUser(user), token });
});

// @desc Authentication : make sure the user is logged in .
exports.protect = asyncHandler(async (req, res, next) => {
  // 1 - verify header exists
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer"))
    return next(new ApiError("NOT AUTHENTICATED", 401));

  token = token.split(" ")[1];

  // 2 - verify token is valid and not expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3 - verify user specified by the token does exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("THIS USER BELONGS TO THIS TOKEN NO LONGER EXISTS", 401)
    );
  }

  // 4 - verify user password was not changed after generating the token
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    ); //return time stamp in miliseconds
    // decoded.iat is a timestamp so we convert the date to a timestamp

    if (passwordChangedTimestamp > decoded.iat) {
      // password was changed after the token was created
      return next(
        new ApiError(
          "USER RECENTLY CHANGED HIS PASSWORD, PLEASE LOGIN AGAIN",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc Authorization : make sure the user has the premession .
exports.allow = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(`YOU DON'T HAVE PERMESSION`, 403));
    }
    next();
  });

// @desc Forget Password
// @route Post /api/auth/forget_password
// @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: req.body.email });

  // does the user exist ?
  if (!user) {
    return next(
      new ApiError(`NO ACCOUNT FOR THE E-MAIL ADDRESS : ${email}`, 404)
    );
  }

  // generating a random code and hash it .
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(code)
    .digest("hex");

  // update the user . the code expires after 10 minutes .
  user.passwordCode = hashedCode;
  user.passwordCodeExpires = Date.now() + 10 * 60 * 1000;
  user.passwordCodeVerified = false;

  await user.save();

  const message = `HI ${user.name} \n
  we received a a request to reset the password on your E-shop Account, \n
  your code is : ${code} \n 
  enter this code to complete the reset \n
  if you did not request this code , please ignore the message`;

  // send an email to the user .

  try {
    await sendEmail({
      email: user.email,
      subject: "RESET CODE",
      message: message,
    });
  } catch (err) {
    user.passwordCode = undefined;
    user.passwordCodeExpires = undefined;
    user.passwordCodeVerified = undefined;
    await user.save();
    return next(new ApiError("AN ERROR OCCURED"));
  }

  return res
    .status(200)
    .send("AN EMAIL MESSAGE WAS SENT TO YOUR E-MAIL ADDRESS");
});

// @desc Verify password reset code
// @route Post /api/auth/verify_password_code
// @access Public
exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const code = req.body.code;

  const hashedCode = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(code)
    .digest("hex");

  const user = await User.findOne({
    passwordCode: hashedCode,
    passwordCodeExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("INVAID OR EXPIRED RESET CODE"));
  }

  user.passwordCodeVerified = true;
  await user.save();

  return res.status(200).json({
    status: "SUCCESS",
    message: "PASSWORD RESET CODE IS CORRECT",
  });
});

// @desc Reset password
// @route Post /api/auth/reset_password
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ApiError(`THERE IS NO USER FOR THIS EMAIL : ${email}`, 404)
    );
  }

  if (!user.passwordCodeVerified) {
    return next(new ApiError("RESET CODE NOT VERIFIED", 400));
  }

  const password = req.body.newPassword;
  user.password = password;
  user.passwordCode = undefined;
  user.passwordCodeExpires = undefined;
  user.passwordCodeVerified = undefined;
  await user.save();

  const token = generateToken({ userId: user._id });
  res.status(200).json({ token });
});
