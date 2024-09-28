const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  insertProductIdIntoBody,
  createFilterObj,
} = require("../services/review");

const { protect, allow } = require("../services/auth");

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewsValidator,
} = require("../utils/validators/review");

const router = express.Router({ mergeParams: true });

router.get("/", createFilterObj, getReviewsValidator, getReviews);

router.get("/:id", insertProductIdIntoBody, getReviewValidator, getReview);

router.post("/", protect, allow("user"), createReviewValidator, createReview);

router.put("/:id", protect, allow("user"), updateReviewValidator, updateReview);

router.delete(
  "/:id",
  protect,
  allow("user", "admin"),
  deleteReviewValidator,
  deleteReview
);

module.exports = router;
