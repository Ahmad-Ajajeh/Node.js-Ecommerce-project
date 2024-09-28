const asyncHandler = require("express-async-handler");

const Review = require("../models/review");
const handlersFactory = require("./handlersFactory");

// @desc get list of reviews
// @route Get /api/reviews/
// @access Public

exports.createFilterObj = (req, res, next) => {
  if (req.params.productId) {
    req.filterObj = { product: req.params.productId };
  }
  next();
};

exports.insertProductIdIntoBody = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  next();
};

exports.getReviews = handlersFactory.getAll(Review);

// @desc Get specific review by ID
// @route Post /api/reviews/:id
// @access Public

exports.getReview = handlersFactory.getOne(Review);

// @desc Create review
// @route Post /api/reviews/
// @access Private/Protect/user

exports.createReview = handlersFactory.createOne(Review);

// @desc Update a review
// @route Put /api/reviews/:id
// @access Private/Protect/user

exports.updateReview = handlersFactory.updateOne(Review);
// @desc Delete a review
// @route delete /api/reviews/id
// @access Private/Protect/user-admin

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const doc = await Review.findByIdAndDelete(id);
  if (!doc) {
    next(new ApiError(`NO ${modelName} FOUND WITH THE ID ${id}`, 404));
    return;
  }

  const product = doc.product;
  await Review.calcAverageRatingAndQuantity(product);

  return res.status(200).send("DELETION SUCCEEDED");
});
