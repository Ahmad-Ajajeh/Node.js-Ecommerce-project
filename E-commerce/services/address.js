const asyncHandler = require("express-async-handler");

const { Address } = require("../models/address");
const Product = require("../models/product");
const User = require("../models/user");

// @desc Add address to user
// @route Post /api/address
// @access Protected/user
exports.addAddress = asyncHandler(async (req, res, next) => {
  const address = new Address(req.body);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: address },
    },
    { new: true }
  );

  return res.status(200).json({ data: user.addresses });
});

// @desc Remove address
// @route Delete /api/address
// @access Protected/user
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const addressId = req.params.addressId;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: addressId } },
    },
    { new: true }
  );

  return res.status(200).json({ data: user });
});

// @desc Get logged user addresses
// @route get /api/addresses
// @access Protected/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  return res
    .status(200)
    .json({ results: user.addresses.length, addresses: user.addresses });
});
