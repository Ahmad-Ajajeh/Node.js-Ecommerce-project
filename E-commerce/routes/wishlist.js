const express = require("express");

const { protect, allow } = require("../services/auth");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlist");

const router = express.Router();

router.use(protect, allow("user"));

router.get("/", getLoggedUserWishlist);

router.post("/", addProductToWishlist);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;
