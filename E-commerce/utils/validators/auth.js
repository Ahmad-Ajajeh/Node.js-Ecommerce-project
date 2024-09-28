const { check, query } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const asyncHandler = require("express-async-handler");
const slugify = require("./slugify");

const User = require("../../models/user");

const uniqueEmail = asyncHandler(async (val, { req }) => {
  const user = await User.findOne({ email: val });
  console.log(user);
  if (user) {
    return Promise.reject("THIS E-MAIL ADDRESS ALREADY EXISTS");
  }
  return Promise.resolve();
});

const passwordMatch = (val, { req }) => {
  if (req.body.password && !val) {
    return Promise.reject("PASSWORD CONFIRM IS REQUIRED");
  }

  const match = val === req.body.password;
  if (!match)
    return Promise.reject("THE PASSWORD DOES NOT MATCH THE CONFIRM PASSWORD");
  return Promise.resolve();
};

exports.signupValidator = [
  check("name")
    .exists()
    .notEmpty()
    .withMessage("USER NAME IS REQUIRED")
    .isLength({ min: 3 })
    .withMessage("USER NAME IS TOO SHORT")
    .isLength({ max: 25 })
    .withMessage("USER NAME IS TOO LONG")
    .custom(slugify),
  check("email")
    .exists()
    .notEmpty()
    .withMessage("USER E-MAIL IS REQUIRED")
    .isEmail()
    .withMessage("INVALID E-MAIL ADDERSS")
    .custom(uniqueEmail),
  check("password")
    .exists()
    .notEmpty()
    .withMessage("THE USER PASSWORD IS REQUIRED")
    .isLength({ min: 6 })
    .withMessage("THE USER PASSWORD IS TOO SHORT")
    .isLength({ max: 255 })
    .withMessage("THE USER PASSWORD IS TOO LONG"),
  check("passwordConfirm")
    .exists()
    .notEmpty()
    .withMessage("PASSWORD CONFIRM IS REQUIRED")
    .custom(passwordMatch),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .exists()
    .notEmpty()
    .withMessage("USER E-MAIL IS REQUIRED")
    .isEmail()
    .withMessage("INVALID E-MAIL ADDERSS"),
  check("password")
    .exists()
    .notEmpty()
    .withMessage("THE USER PASSWORD IS REQUIRED"),
  validatorMiddleware,
];
