const express = require("express");

const {
  addToCart,
  getLoggedUserCart,
  removeItem,
  clearCart,
  updateItemQuantity,
  applyCoupon,
} = require("../services/cart");
const { protect, allow } = require("../services/auth");

const router = express.Router();

router.use(protect, allow("user"));

router.get("/", getLoggedUserCart);

router.post("/", addToCart);

router.put("/apply_coupon", applyCoupon);

router.put("/:itemId", updateItemQuantity);

router.delete("/:itemId", removeItem);

router.delete("/", clearCart);

module.exports = router;
