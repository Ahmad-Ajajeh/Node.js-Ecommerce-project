const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { address } = require("./address");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "USER NAME IS REQUIRED"],
      minlength: [3, "USER NAME IS TOO SHORT"],
      maxlength: [25, "USER NAME IS TOO LONG"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "USER E-MAIL IS REQUIRED"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: true,
      minlength: [6, "THE PASSWORD IS TOO SHORT"],
      maxlength: [255, "THE PASSWORD IS TOO LONG"],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordCode: {
      type: String,
    },
    passwordCodeExpires: {
      type: Date,
    },
    passwordCodeVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [address],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// if child references will be large => convert it to parent reference .
