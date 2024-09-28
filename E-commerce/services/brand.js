const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const Brand = require("../models/brand");
const handlersFactory = require("./handlersFactory");

exports.uploadBrandImage = uploadSingleImage("image");

exports.adjustBrandImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const extension = req.file.mimetype.split("/")[1];
    const filename = `brand-${uuidv4()}-${Date.now()}.${extension}`;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);

    req.body.image = filename;
  }

  next();
});

// @desc get list of brands
// @route Get /api/brands/
// @access Public

exports.getBrands = handlersFactory.getAll(Brand);

// @desc Get specific brand by ID
// @route Post /api/brands/:id
// @access Public

exports.getBrand = handlersFactory.getOne(Brand);

// @desc Create brand
// @route Post /api/brands/
// @access Private/Protect/Admin

exports.createBrand = handlersFactory.createOne(Brand);

// @desc Update a brand
// @route Put /api/brands/:id
// @access Private/Protect/Admin

exports.updateBrand = handlersFactory.updateOne(Brand);
// @desc Delete a brand
// @route delete /api/brands/id
// @access Private/Protect/Admin

exports.deleteBrand = handlersFactory.deleteOne(Brand);
