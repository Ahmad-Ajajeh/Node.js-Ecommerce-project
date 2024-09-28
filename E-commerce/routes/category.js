const express = require("express");

const {
  uploadCategoryImage,
  adjustCategoryImage,
} = require("../services/category");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/category");

const { protect, allow } = require("../services/auth");

const {
  getCategoryValidator,
  createCategoryValildator,
  updateCategoryValidator,
  deleteCategoryValidator,
  getCategoriesValidator,
} = require("../utils/validators/category");

const subCategoriesRouter = require("./subCategory");

const router = express.Router();

router.use("/:categoryId/sub_categories", subCategoriesRouter);

router.get("/", getCategoriesValidator, getCategories);

router.get("/:id", getCategoryValidator, getCategory);

router.post(
  "/",
  protect,
  allow("admin", "manager"),
  uploadCategoryImage,
  adjustCategoryImage,
  createCategoryValildator,
  createCategory
);

router.put(
  "/:id",
  protect,
  allow("admin", "manager"),
  uploadCategoryImage,
  adjustCategoryImage,
  updateCategoryValidator,
  updateCategory
);

router.delete(
  "/:id",
  protect,
  allow("admin", "manager"),
  deleteCategoryValidator,
  deleteCategory
);

module.exports = router;
