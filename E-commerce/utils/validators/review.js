const { check, query } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const queryValidator = require("./queryValidator");
const Review = require("../../models/review");
const asyncHandler = require("express-async-handler");

const onlyOneRatingForUser = asyncHandler(async (val, { req }) => {
  const review = await Review.findOne({ user: req.user._id, product: val });
  if (review) {
    return Promise.reject("THE USER CAN RATE THE PRODUCT FOR ONCE ONLY");
  }
  return Promise.resolve();
});

const checkReviewBelongsToUser = asyncHandler(async (val, { req }) => {
  const review = await Review.findById(val);
  if (!review) {
    return Promise.reject(`NO REVIEW WAS FOUND WITH THE ID ${val}`);
  }
  if (review.user._id.toString() !== req.user._id.toString()) {
    console.log("user", review.user);
    console.log("token", req.user._id);
    return Promise.reject(`YOU ARE NOT ALLOWED TO DO THIS ACTION ! `);
  }

  return Promise.resolve();
});

const checkAuthorizedToDeleteReview = asyncHandler(async (val, { req }) => {
  const review = await Review.findById(val);

  if (!review) {
    return Promise.reject(`NO REVIEW WAS FOUND WITH THE ID ${val}`);
  }

  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== review.user._id.toString()
  ) {
    return Promise.reject("YOU CAN DELETE ONLY YOUR REVIEWS");
  }

  return Promise.resolve();
});

exports.getReviewsValidator = [
  query("page").custom(queryValidator),
  check("limit").custom(queryValidator),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("INVALID REVIEW ID"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title")
    .optional()
    .isLength({ max: 1024 })
    .withMessage("REVIEW TITLE IS TOO LONG"),
  check("ratings")
    .exists()
    .notEmpty()
    .withMessage("THE RATING IS REQUIRED")
    .isFloat({ min: 1, max: 5 })
    .withMessage("THE RATING SHOULD BE BETWEEN 1 AND 5"),
  check("user").isMongoId().withMessage("INVALID USER ID"),
  check("product")
    .isMongoId()
    .withMessage("INVALID PRODUCT ID")
    .custom(onlyOneRatingForUser),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("INVALID BRAND ID")
    .custom(checkReviewBelongsToUser),
  check("title")
    .optional()
    .isLength({ max: 1024 })
    .withMessage("REVIEW TITLE IS TOO LONG"),
  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("THE RATING SHOULD BE BETWEEN 1 AND 5"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("INVALID REVIEW ID")
    .custom(checkAuthorizedToDeleteReview),
  validatorMiddleware,
];
