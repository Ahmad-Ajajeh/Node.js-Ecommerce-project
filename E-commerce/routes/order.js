const express = require("express");

const {
  createCashOrder,
  createFilterObj,
  getOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkOutSession,
} = require("../services/order");

const { protect, allow } = require("../services/auth");

const router = express.Router();

router.use(protect);

router.get("/", allow("admin"), createFilterObj, getOrders);

router.get("/:id", allow("admin", "user"), getOrder);

router.get(
  "/checkout_session/:cartId",
  protect,
  allow("user"),
  checkOutSession
);

router.post("/", allow("user"), createCashOrder);

router.put("/:id/pay", allow("admin"), updateOrderToPaid);

router.put("/:id/deliver", allow("admin"), updateOrderToDelivered);

module.exports = router;
