const mongoose = require("mongoose");

const Product = require("../models/product");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "THE RATING MUST BE BETWEEN 1 AND 5"],
      max: [5, "THE RATING MUST BE BETWEEN 1 AND 5"],
      required: [true, "THE RATINGS IS REQUIRED"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      requried: [true, "THE REVIEW MUST BELONG TO A USER"],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "THE REVIEW MUST BELONG TO A PRODUCT"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAverageRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    // stage 1 : get all reviews in specific product
    { $match: { product: productId } },
    // stage 2 : grouping reviews based on productId and calc ratings average and quantity
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsCount: result[0].ratingsCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsCount: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingAndQuantity(this.product);
});

reviewSchema.post("findOneAndDelete", async function () {});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
