const express = require("express");
const { param, body, validationResult } = require("express-validator");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  adjustProductImages,
} = require("../services/product");

const {
  getProductValidator,
  createProductValildator,
  updateProductValidator,
  deleteProductValidator,
  getProductsValidator,
} = require("../utils/validators/product");

const { protect, allow } = require("../services/auth");

const reviewsRouter = require("../routes/review");

const router = express.Router();

router.use("/:productId/reviews", reviewsRouter);

router.get("/", getProductsValidator, getProducts);

router.get("/:id", getProductValidator, getProduct);

router.post(
  "/",
  protect,
  allow("admin", "manager"),
  uploadProductImages,
  adjustProductImages,
  createProductValildator,
  createProduct
);

router.put(
  "/:id",
  protect,
  allow("admin", "manager"),
  updateProductValidator,
  uploadProductImages,
  adjustProductImages,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  allow("admin", "manager"),
  deleteProductValidator,
  deleteProduct
);

module.exports = router;
