const { check, query } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const queryValidator = require("./queryValidator");
const Brand = require("../../models/brand");
const slugify = require("./slugify");

const uniqueValue = async (p) => {
  const brand = await Brand.findOne({ title: p });
  if (brand) return Promise.reject();
  return Promise.resolve();
};

exports.getBrandsValidator = [
  query("page").custom(queryValidator),
  check("limit").custom(queryValidator),
  validatorMiddleware,
];

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("INVALID BRAND ID"),
  validatorMiddleware,
];

exports.createBrandValildator = [
  check("title")
    .exists()
    .notEmpty()
    .withMessage("BRAND TITLE IS REQUIRED")
    .isLength({ min: 3 })
    .withMessage("BRAND TITLE IS TOO SHORT")
    .isLength({ max: 32 })
    .withMessage("BRAND TITLE IS TOO LONG")
    .custom(uniqueValue)
    .withMessage("THE BRAND TITLE SHOULD BE UNIQUE")
    .custom(slugify),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("INVALID BRAND ID"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("BRAND TITLE IS TOO SHORT")
    .isLength({ max: 32 })
    .withMessage("BRAND TITLE IS TOO LONG")
    .custom(uniqueValue)
    .withMessage("THE BRAND TITLE SHOULD BE UNIQUE")
    .custom(slugify),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("INVALID BRAND ID"),
  validatorMiddleware,
];
