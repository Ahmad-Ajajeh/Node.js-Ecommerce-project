const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const ApiFeatures = require("../utils/ApiFeatures");
const ApiError = require("../utils/apiError");
const SubCategory = require("../models/subCategory");
const handlersFactory = require("./handlersFactory");

exports.insertCategoryIdIntoBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

exports.createFilterObj = (req, res, next) => {
  if (req.params.categoryId) {
    req.filterObj = { category: req.params.categoryId };
  }
  next();
};

// @desc get all subcategories of a category
// @route Get /api/sub_categories
// @access Public

exports.getSubCategories = handlersFactory.getAll(SubCategory);

// @desc get a specifc subcategory
// @route Get /api/sub_categories/:id
// @access Public

exports.getSubCategory = handlersFactory.getOne(SubCategory);

// @desc create subcategory
// @route Post /api/sub_categories
// @access Private

exports.createSubCategory = handlersFactory.createOne(SubCategory);

// @desc update subcategory
// @route Put /api/sub_categories
// @access Private

exports.updateSubCategory = handlersFactory.updateOne(SubCategory);

// @desc delete subcategory
// @route Delete /api/sub_categories
// @access Private

exports.deleteSubCategory = handlersFactory.deleteOne(SubCategory);
