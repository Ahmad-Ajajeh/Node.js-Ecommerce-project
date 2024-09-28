const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");
const User = require("../models/user");
const handlersFactory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.adjustUserImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const extension = req.file.mimetype.split("/")[1];
    const filename = `user-${uuidv4()}-${Date.now()}.${extension}`;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImage = filename;
  }

  next();
});

// @desc get list of users
// @route Get /api/users/
// @access Private

exports.getUsers = handlersFactory.getAll(User);

// @desc Get specific user by ID
// @route Post /api/users/:id
// @access Private

exports.getUser = handlersFactory.getOne(User);

// @desc Create user
// @route Post /api/users/
// @access Private

exports.createUser = handlersFactory.createOne(User);

// @desc Update a user
// @route Put /api/users/:id
// @access Private

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      profileImage: req.body.profileImage,
      phone: req.body.phone,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`NO USER WAS FOUND WITH THE ID ${req.params.id}`));
  }
  return res.status(200).json({ data: user });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const password = await bcrypt.hash(req.body.password, 12);

  const user = await User.findByIdAndUpdate(
    id,
    { password, passwordChangedAt: Date.now() },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(`NO USER WAS FOUND WITH THE ID ${id}`));
  }

  return res.status(200).json({ data: user });
});

// @desc Delete a user
// @route delete /api/users/id
// @access Private

exports.deleteUser = handlersFactory.deleteOne(User);

// @desc Get logged user data
// @route Get /api/users/get_me
// @access Private
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc Update logged user password
// @route PUT /api/user/update_my_password
// @access Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const password = await bcrypt.hash(req.body.password, 12);

  const user = await User.findByIdAndUpdate(
    id,
    { password, passwordChangedAt: Date.now() },
    { new: true }
  );

  const token = generateToken({ userId: user._id });
  return res.status(200).json({ data: user, token });
});

// @desc Update logged user data ( not password or role)
// @route Put /api/users/update_me
// @access Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: user });
});

// @desc Deactivate logged user
// @route DELETE /api/users/delete_me
// @access Private/Protect
module.exports.deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  await User.findByIdAndUpdate(id, { active: false });

  return res.status(204);
});
