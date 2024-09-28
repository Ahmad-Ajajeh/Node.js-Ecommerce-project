const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  insertCategoryIdIntoBody,
  createFilterObj,
} = require("../services/subCategory");
const {
  createSubCategoryValidator,
  getSubCategoriesValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategory");

const { protect, allow } = require("../services/auth");

const router = express.Router({ mergeParams: true });

router.get("/", createFilterObj, getSubCategoriesValidator, getSubCategories);

router.get("/:id", getSubCategoryValidator, getSubCategory);

router.post(
  "/",
  protect,
  allow("admin", "manager"),
  insertCategoryIdIntoBody,
  createSubCategoryValidator,
  createSubCategory
);

router.put(
  "/:id",
  protect,
  allow("admin", "manager"),
  updateSubCategoryValidator,
  updateSubCategory
);

router.delete(
  "/:id",
  protect,
  allow("admin", "manager"),
  deleteSubCategoryValidator,
  deleteSubCategory
);

router.get("/:categoryId/subCategories");

module.exports = router;
