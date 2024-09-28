const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  return totalPrice;
};

// @desc Add product to cart
// @route Post /api/carts
// @access Private/User
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity } = req.body;

  // affirm that the product exists .
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(`NO PRODUCT WAS FOUND WITH THE ID ${productId}`));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // No cart for the user
    cart = new Cart({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          quantity,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    // The user has a cart , either :
    // 1 - product exists in the cart , update product qunatity .
    // 2 - push product to cartItems array .

    // check if the item exists in the cart .
    const index = cart.cartItems.findIndex((item) => {
      return (
        item.product.toString() === productId && item.color === req.body.color
      );
    });

    if (index > -1) {
      const item = cart.cartItems[index];
      item.quantity += quantity;
      cart.cartItems[index] = item;
    } else {
      const item = {
        product: productId,
        quantity,
        color,
        price: product.price,
      };

      cart.cartItems.push(item);
    }
  }

  // calculate total price

  cart.totalPrice = calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({ cart: cart });
});

// @desc Get logged user cart
// @route Get /api/carts
// @access Private/user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`NO CART FOUND FOR THE USER ID ${req.user._id}`, 404)
    );
  }

  return res.status(200).json({ cart: cart });
});

// @desc Remove an item from the cart
// @route Put /api/carts/:itemId
// @access Private/user
exports.removeItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  cart.totalPrice = calcTotalPrice(cart);
  await cart.save();

  return res.status(200).json({ cart: cart });
});

// @desc Clear user cart
// @route Delete /api/carts
// @access Private/user

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(200).send("DELETION SUCCEEDED");
});

// @desc update cart item quantity
// @route Get /api/carts/:itemId
// @access Private/user
exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  const { quantity } = req.body;

  if (!cart) {
    return next(
      new ApiError(
        `THERE IS NO CART FOR THE USRE WITH THE ID : ${req.user._id}`
      )
    );
  }

  const index = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (index > -1) {
    const cartItem = cart.cartItems[index];
    cartItem.quantity = quantity;
    cart.cartItems[index] = cartItem;
  } else {
    return next(
      new ApiError(`THERE IS NO ITEM FOR THE ID ${req.params.itemId}`, 404)
    );
  }

  cart.totalPrice = calcTotalPrice(cart);
  return res.status(200).json({ cart: cart });
});

// @desc Apply coupon on logged user
// @route Put /api/carts/apply_coupon
// @access Private/user

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    title: req.body.coupon,
    expires: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`THE COUPON IS EITHER EXPIRED OR DOES NOT EXIST`));
  }

  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = calcTotalPrice(cart);

  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  return res.status(200).json({ cart: cart });
});
