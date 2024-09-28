const stripe = require("stripe")(
  "sk_test_51O68DBEHMc8CaqhBLZmmjJX0F3AcOrxJGXfQZ0NWCPSJlOAXnWURmwnxKsWEsbgu8T2tk7OaiuuySvLijATMW1Z000L2GXOMqu"
);
const asyncHandler = require("express-async-handler");

const Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");
const handlersFactory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

exports.createFilterObj = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

// @desc create cash order for logged user cart
// @route POST /api/orders/
// @access Protected/user

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`THERE IS NO CART FOR THE USER WITH THE ID ${req.user._id}`),
      404
    );
  }

  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});

    await Cart.findByIdAndDelete(cart._id);
    return res.status(200).json({ order });
  }
  return next(new ApiError(`UNABLE TO MAKE YOUR ORDER`), 400);
});

// @desc get all orders
// @route GET /api/orders/
// @access Protected/admin-user

exports.getOrders = handlersFactory.getAll(Order);

// @desc get one order
// @route GET /api/orders/:id
// @access Protected/admin-user

exports.getOrder = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let order = await Order.findById(req.params.id);

  if (!order) {
    next(new ApiError(`NO ORDER FOUND WITH THE ID ${id}`, 404));
    return;
  }

  console.log(order.user);
  console.log(req.user._id);

  if (order.user._id.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(`YOU DON'T HAVE PERMESSION TO DO THIS ACTION`, 401)
    );
  }

  res.status(200).json({ data: order });
});

// @desc update order paid status to true
// @route PUT /api/orders/:id/pay
// @access Protected/admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`THERE IS NO ORDER WITH THE ID ${req.params.id}`),
      404
    );
  }

  if (order.paid) {
    return next(
      new ApiError(`THE ORDER WITH THE ID ${req.params.id} IS ALREADY PAID`)
    );
  }

  order.paid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  return res.status(200).json({ order: updatedOrder });
});

// @desc update order delivered status to true
// @route PUT /api/orders/:id/deliver
// @access Protected/admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`THERE IS NO ORDER WITH THE ID ${req.params.id}`),
      404
    );
  }

  if (order.paid) {
    return next(
      new ApiError(
        `THE ORDER WITH THE ID ${req.params.id} IS ALREADY DELIVERED`
      )
    );
  }

  order.delivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  return res.status(200).json({ order: updatedOrder });
});

// @desc Get checkout session from stripe and send it as a response
// @route Get /api/orders/checkout_session/:cartId
// @access Protected/User
exports.checkOutSession = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`THERE IS NO CART FOR THE USER WITH THE ID ${req.user._id}`),
      404
    );
  }

  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const totalPrice = cartPrice + taxPrice + shippingPrice;

  // create stripe check out session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: totalPrice * 100,
          product_data: { name: "Cart Total" },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/orders/`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/carts/`,
    customer_email: req.user.email,
    client_reference_id: cart._id,
    metadata: req.body.shippingAddress,
  });

  // send the session to response
  return res.status(200).json({ session: session });
});
