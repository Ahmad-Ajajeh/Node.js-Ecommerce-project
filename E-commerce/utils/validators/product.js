const { check, query } = require("express-validator");

const {
  checkSubCategoriesExist,
  checkCategoryExists,
  checkSubCategoriesBelongToCategory,
} = require("./checkExistence");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const queryValidator = require("./queryValidator");
const slugify = require("./slugify");

exports.getProductsValidator = [
  query("page").custom(queryValidator),
  check("limit").custom(queryValidator),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("INVALID PRODUCT ID"),
  validatorMiddleware,
];

exports.createProductValildator = [
  check("title")
    .notEmpty()
    .withMessage("PRODUCT TITLE IS REQUIRED")
    .isLength({ min: 3 })
    .withMessage("PRODUCT TITLE IS TOO SHORT")
    .isLength({ max: 100 })
    .withMessage("PRODUCT TITLE IS TOO LONG")
    .custom(slugify),
  check("description")
    .notEmpty()
    .withMessage("PRODUCT DESCRIPTION IS REQUIRED")
    .isLength({ min: 20, max: 1024 })
    .withMessage("THE PRODCUT DESCRIPTION SHOULD BE BETWEEN 20 AND 1024 CHARS"),
  check("quantity")
    .exists()
    .withMessage("THE PRODUCT QUANTITY IS REQUIRED")
    .isInt({ gt: 0 })
    .withMessage("THE PRODUCT QUANTITY CANNOT BE LESS THAN 0"),
  check("price")
    .exists()
    .withMessage("THE PRODUCT PRICE IS REQUIRED")
    .isFloat({ min: 0.59, max: 100000.0 })
    .withMessage("THE PRODUCT PRICE SHOULD BE BETWEEN 0.59 AND 100000"),
  check("postDiscountPrice")
    .optional()
    .isFloat({ min: 0.59, max: 100000.0 })
    .withMessage("THE POST DISCOUNT PRICE SHOULD BE BETWEEN 0.59 AND 100000")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) return Promise.reject();
    })
    .withMessage("THE POST DISCOUNT PRICE SHOULD BE LESS THAN THE PRICE"),
  check("colors")
    .optional()
    .isArray()
    .withMessage("THE PRODCUT COLORS MUST BE AN ARRAY"),
  check("coverImage").notEmpty().withMessage("PRODUCT COVER IS REQUIRED"),
  check("images")
    .optional()
    .isArray()
    .withMessage("PRODUCT IMAGES MUST BE AN ARRAY"),
  check("category")
    .exists()
    .withMessage("THE PRODUCT MUST BELONG TO A CATEGORY")
    .isMongoId()
    .withMessage("INVALID CATEGORY ID ")
    .custom(checkCategoryExists),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("SUBCATEGORIES MUST BE AN ARRAY")
    .custom(checkSubCategoriesExist)
    .custom(checkSubCategoriesBelongToCategory),
  check("brand").optional().isMongoId().withMessage("INVALID BRAND ID"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("INVALID PRODUCT ID"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("PRODUCT TITLE IS TOO SHORT")
    .isLength({ max: 100 })
    .withMessage("PRODUCT TITLE IS TOO LONG")
    .custom(slugify),
  check("description")
    .optional()

    .isLength({ min: 20, max: 1024 })
    .withMessage("THE PRODCUT DESCRIPTION SHOULD BE BETWEEN 20 AND 1024 CHARS"),
  check("quantity")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("THE PRODUCT QUANTITY CANNOT BE LESS THAN 0"),
  check("price")
    .optional()
    .isFloat({ gt: 0.59, lt: 100000.0 })
    .toFloat()
    .withMessage("THE PRODUCT PRICE SHOULD BE BETWEEN 0.59 AND 100000"),
  check("postDiscountPrice")
    .optional()
    .isFloat({ gt: 0.59, lt: 100000.0 })
    .withMessage("THE POST DISCOUNT PRICE SHOULD BE BETWEEN 0.59 AND 100000")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) return Promise.reject();
    })
    .withMessage("THE POST DISCOUNT PRICE SHOULD BE LESS THAN THE PRICE"),
  check("colors")
    .optional()
    .isArray()
    .withMessage("THE PRODCUT COLORS MUST BE AN ARRAY"),
  check("coverImage").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("PRODUCT IMAGES MUST BE AN ARRAY"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("INVALID CATEGORY ID ")
    .custom(checkCategoryExists),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("SUBCATEGORIES MUST BE AN ARRAY")
    .custom(checkSubCategoriesExist)
    .custom(checkSubCategoriesBelongToCategory),
  check("brand").optional().isMongoId().withMessage("INVALID BRAND ID"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("INVALID PRODUCT ID"),
  validatorMiddleware,
];
