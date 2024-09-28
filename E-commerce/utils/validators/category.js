const { check, query } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const queryValidator = require("./queryValidator");
const Category = require("../../models/category");
const slugify = require("./slugify");

const uniqueValue = async (p) => {
  const category = await Category.findOne({ title: p });
  if (category) return Promise.reject();
  return Promise.resolve();
};

exports.getCategoriesValidator = [
  query("page").custom(queryValidator),
  check("limit").custom(queryValidator),
  validatorMiddleware,
];

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("INVALID CATEGORY ID"),
  validatorMiddleware,
];

exports.createCategoryValildator = [
  check("title")
    .exists()
    .notEmpty()
    .withMessage("CATEGORY TITLE IS REQUIRED")
    .isLength({ min: 3 })
    .withMessage("CATEGORY TITLE IS TOO SHORT")
    .isLength({ max: 32 })
    .withMessage("CATEGORY TITLE IS TOO LONG")
    .custom(uniqueValue)
    .withMessage("THE CATEGORY TITLE SHOULD BE UNIQUE")
    .custom(slugify),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("INVALID CATEGORY ID"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("CATEGORY TITLE IS TOO SHORT")
    .isLength({ max: 32 })
    .withMessage("CATEGORY TITLE IS TOO LONG")
    .custom(uniqueValue)
    .withMessage("THE CATEGORY TITLE SHOULD BE UNIQUE")
    .custom(slugify),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("INVALID CATEGORY ID"),
  validatorMiddleware,
];
