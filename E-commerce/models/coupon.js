const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "THE COUPON TITLE IS REQUIRED"],
      unique: [true, "THE COUPON TITLE MUST BE UNIQUE"],
    },
    expires: {
      type: Date,
      required: [true, "COUPON EXPIRATION TIME IS REQUIRED"],
    },
    discount: {
      type: Number,
      required: [true, "THE DISCOUNT VALUE IS REQUIRED"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
