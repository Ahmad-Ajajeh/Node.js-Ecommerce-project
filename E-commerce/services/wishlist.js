const asyncHandler = require("express-async-handler");

const Product = require("../models/product");
const ApiError = require("../utils/apiError");
const User = require("../models/user");

// @desc Add product to wishlist
// @route Post /api/wishlist
// @access Protected/user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const productId = req.body.productId;

  const product = Product.findById(productId);

  if (!product) {
    return next(new ApiError(`NO PRODUCT FOUND WITH THE ID ${productId}`));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: productId },
    },
    { new: true }
  );

  return res.status(200).json({ data: user.wishlist });
});

// @desc Remove product to wishlist
// @route Delete /api/wishlist
// @access Protected/user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;
  console.log(productId);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: productId },
    },
    { new: true }
  );

  return res.status(200).json({ data: user });
});

// @desc Get logged user wishlist
// @route get /api/wishlist
// @access Protected/user
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  return res
    .status(200)
    .json({ results: user.wishlist.length, wishlist: user.wishlist });
});
