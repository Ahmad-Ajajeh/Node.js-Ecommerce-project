const { check, query } = require("express-validator");

const { checkCategoryExists } = require("./checkExistence");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const queryValidator = require("./queryValidator");
const SubCategory = require("../../models/subCategory");
const slugify = require("./slugify");

const uniqueValue = async (p) => {
  const subCategory = await SubCategory.findOne({ title: p });
  if (subCategory) return Promise.reject();
  return Promise.resolve();
};

exports.getSubCategoriesValidator = [
  query("page").custom(queryValidator),
  query("limit").custom(queryValidator),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("INVALID SUBCATEGORY ID"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("title")
    .exists()
    .notEmpty()
    .withMessage("SUBCATEGORY TITLE IS REQUIRED")
    .isLength({ min: 2 })
    .withMessage("SUBCATEGORY TITLE IS TOO SHORT")
    .isLength({ max: 32 })
    .withMessage("SUBCATEGORY TITLE IS TOO LONG")
    .custom(uniqueValue)
    .withMessage("THE SUBCATEGORY NAME SHOULD BE UNIQUE")
    .custom(slugify),
  check("category")
    .exists()
    .withMessage("CATEGORY ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID CATEGORY ID")
    .custom(checkCategoryExists),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("INVALID SUBCATEGORY ID"),
  check("title")
    .exists()
    .notEmpty()
    .withMessage("SUBCATEGORY TITLE IS REQUIRED")
    .isLength({ min: 2 })
    .withMessage("SUBCATEGORY TITLE IS TOO SHORT")
    .isLength({ max: 32 })
    .withMessage("SUBCATEGORY TITLE IS TOO LONG")
    .custom(uniqueValue)
    .withMessage("THE SUBCATEGORY NAME SHOULD BE UNIQUE")
    .custom(slugify),
  check("category")
    .exists()
    .withMessage("CATEGORY ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID CATEGORY ID")
    .custom(checkCategoryExists),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("INVALID SUBSUBCATEGORY ID"),
  validatorMiddleware,
];
