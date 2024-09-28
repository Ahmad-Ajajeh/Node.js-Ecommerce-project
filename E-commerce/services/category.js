const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const Category = require("../models/category");
const handlersFactory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.adjustCategoryImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const extension = req.file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${extension}`;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    req.body.image = filename;
  }

  next();
});

// @desc Get list of categories
// @route Get /api/cateogries
// @access Public
exports.getCategories = handlersFactory.getAll(Category);
// @desc Get specific category by ID
// @route Post /api/categories/:id
// @access Public

exports.getCategory = handlersFactory.getOne(Category);

// @desc Create category
// @route Post /api/categories/
// @access Private/Protect/Admin

exports.createCategory = handlersFactory.createOne(Category);

// @desc Update a category
// @route Put /api/categories/:id
// @access Private/Protect/Admin

exports.updateCategory = handlersFactory.updateOne(Category);

// @desc Delete a category
// @route delete /api/categories/id
// @access Private/Protect/Admin

exports.deleteCategory = handlersFactory.deleteOne(Category);
