const express = require("express");
const { param, body, validationResult } = require("express-validator");
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  adjustBrandImage,
  uploadBrandImage,
} = require("../services/brand");

const { protect, allow } = require("../services/auth");

const {
  getBrandValidator,
  createBrandValildator,
  updateBrandValidator,
  deleteBrandValidator,
  getBrandsValidator,
} = require("../utils/validators/brand");

const router = express.Router();

router.get("/", getBrandsValidator, getBrands);

router.get("/:id", getBrandValidator, getBrand);

router.post(
  "/",
  protect,
  allow("admin", "manager"),
  uploadBrandImage,
  adjustBrandImage,
  createBrandValildator,
  createBrand
);

router.put(
  "/:id",
  protect,
  allow("admin", "manager"),
  uploadBrandImage,
  adjustBrandImage,
  updateBrandValidator,
  updateBrand
);

router.delete(
  "/:id",
  protect,
  allow("admin", "manager"),
  deleteBrandValidator,
  deleteBrand
);

module.exports = router;
