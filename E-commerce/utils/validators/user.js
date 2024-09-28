const { check, query } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const asyncHandler = require("express-async-handler");
const slugify = require("./slugify");
const bcrypt = require("bcryptjs");

const queryValidator = require("./queryValidator");
const User = require("../../models/user");
const { default: mongoose } = require("mongoose");

const uniqueEmail = asyncHandler(async (val, { req }) => {
  const user = await User.findOne({ email: val });
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

const checkCorrectPassword = asyncHandler(async (val, { req }) => {
  let id = req.params.id;

  if (req.user) {
    id = req.user._id;
  }

  const validID = mongoose.isValidObjectId(id);
  if (!validID) {
    return Promise.reject("INVALID ID");
  }
  const user = await User.findById(id).select("password");
  if (!user) {
    return Promise.reject(`NO USER FOUND WITH THE ID ${id}`);
  }

  const match = await bcrypt.compare(val, user.password);

  if (!match) {
    return Promise.reject("INCORRECT CREDENTIALS");
  }
  return Promise.resolve();
});

const checkUpdateId = (val, { req }) => {
  if (val) {
    if (!mongoose.isValidObjectId(val)) {
      return Promise.reject("INVALID ID");
    }
  }

  if (!val && !req.user) {
    return Promise.reject("THE ID IS REQUIRED");
  }
  return Promise.resolve();
};

exports.getUsersValidator = [
  query("page").custom(queryValidator),
  check("limit").custom(queryValidator),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("INVALID USER ID"),
  validatorMiddleware,
];

exports.createUserValidator = [
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
  check("profileImage").optional(),
  check("role").optional(),
  check("phone").optional().isMobilePhone(["ar-EG", "ar-SY"]),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").custom(checkUpdateId),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("USER NAME IS TOO SHORT")
    .isLength({ max: 25 })
    .withMessage("USER NAME IS TOO LONG")
    .custom(slugify),
  check("email")
    .optional()
    .isEmail()
    .withMessage("INVALID E-MAIL ADDERSS")
    .custom(uniqueEmail),
  // check("password")
  //   .optional()
  //   .isLength({ min: 6 })
  //   .withMessage("THE USER PASSWORD IS TOO SHORT")
  //   .isLength({ max: 255 })
  //   .withMessage("THE USER PASSWORD IS TOO LONG"),
  // check("passwordConfirm").custom(passwordMatch),
  check("profileImage").optional(),
  check("role").optional(),
  check("phone").optional().isMobilePhone(["ar-EG", "ar-SY"]),

  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("currentPassword")
    .exists()
    .notEmpty()
    .withMessage("THE CURRENT PASSWORD IS REQUIRED")
    .custom(checkCorrectPassword),
  check("password")
    .isLength({ min: 6 })
    .withMessage("THE USER PASSWORD IS TOO SHORT")
    .isLength({ max: 255 })
    .withMessage("THE USER PASSWORD IS TOO LONG"),
  check("passwordConfirm").custom(passwordMatch),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("INVALID USER ID"),
  validatorMiddleware,
];
