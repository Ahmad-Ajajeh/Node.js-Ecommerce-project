const express = require("express");

const {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/coupon");
const { protect, allow } = require("../services/auth");

const router = express.Router();

router.use(protect, allow("user"));

router.get("/", getCoupons);

router.get("/:id", getCoupon);

router.post("/", createCoupon);

router.put("/:id", updateCoupon);

router.delete("/:id", deleteCoupon);

module.exports = router;
