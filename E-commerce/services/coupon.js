const Coupon = require("../models/coupon");
const handlersFactory = require("./handlersFactory");

// @desc get list of coupons
// @route Get /api/coupons/
// @access Protected/admin

exports.getCoupons = handlersFactory.getAll(Coupon);

// @desc Get specific coupon by ID
// @route Post /api/coupons/:id
// @access Protected/admin

exports.getCoupon = handlersFactory.getOne(Coupon);

// @desc Create coupon
// @route Post /api/coupons/
// @access Protected/admin

exports.createCoupon = handlersFactory.createOne(Coupon);

// @desc Update a coupon
// @route Put /api/coupons/:id
// @access Protected/admin

exports.updateCoupon = handlersFactory.updateOne(Coupon);

// @desc Delete a coupon
// @route delete /api/coupons/id
// @access Protected/admin

exports.deleteCoupon = handlersFactory.deleteOne(Coupon);
