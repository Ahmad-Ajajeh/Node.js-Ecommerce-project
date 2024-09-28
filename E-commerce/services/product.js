const multer = require("multer");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/ApiFeatures");
const Product = require("../models/product");
const handlersFactory = require("./handlersFactory");
const {
  uploadMultipleImages,
} = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMultipleImages([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.adjustProductImages = asyncHandler(async (req, res, next) => {
  console.log(req.files);

  if (req.files) {
    if (req.files.coverImage) {
      const coverImageFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.coverImage[0].buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${coverImageFileName}`);

      req.body.coverImage = coverImageFileName;
    }

    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (im, index) => {
          const imageFileName = `product-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;
          await sharp(im.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${imageFileName}`);

          req.body.images.push(imageFileName);
        })
      );
    }
  }
  next();
});

// @desc get list of products
// @route Get /api/products
// @access public
exports.getProducts = handlersFactory.getAll(Product);

// @desc get specific product by ID
// @route Get /api/products/:id
// @access Public

exports.getProduct = handlersFactory.getOne(Product, "reviews");

// @desc create a product
// @route Post /api/products
// @access Private/Protect/Admin

exports.createProduct = handlersFactory.createOne(Product);
// @desc update a product by its id
// @route Put /api/products/:id
// @access Private/Protect/Admin

exports.updateProduct = handlersFactory.updateOne(Product);

// @desc delete a product by its id
// @route Delete /api/products/:id
// @access Private/Protect/Admin

exports.deleteProduct = handlersFactory.deleteOne(Product);
