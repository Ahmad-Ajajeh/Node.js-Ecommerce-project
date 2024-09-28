const mongoose = require("mongoose");
const { address } = require("../models/address");
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "THE ORDER MUST BELONG TO A USER"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: address,
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    delivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone",
  }).populate({ path: "cartItems.product", select: "title coverImage" });

  next();
});

module.exports = mongoose.model("Order", orderSchema);
