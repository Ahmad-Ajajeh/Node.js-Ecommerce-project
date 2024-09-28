const Category = require("../../models/category");
const SubCategory = require("../../models/subCategory");

exports.checkCategoryExists = async (value) => {
  const category = await Category.findById(value);
  if (!category) {
    return Promise.reject(`NO CATEGORY FOR THIS ID ${value}`);
  }
  return Promise.resolve();
};

exports.checkSubCategoriesExist = async (value) => {
  const subCategories = await SubCategory.find({
    _id: { $exists: true, $in: value },
  });
  if (subCategories.length !== value.length) {
    return Promise.reject("SOME SUBCATEGORIES ARE NOT FOUND");
  }
  return Promise.resolve();
};

exports.checkSubCategoriesBelongToCategory = async (value, { req }) => {
  const category = req.body.category;
  const subCategories = await SubCategory.find({ category });
  const ids = [];
  subCategories.forEach((p) => {
    ids.push(p._id.toString());
  });
  let fails = false;
  value.forEach((v) => {
    if (!ids.includes(v)) {
      fails = true;
    }
  });
  if (fails)
    return Promise.reject("SOME SUBCATEGORIES DOES NOT BELONG TO THE CATEGORY");
  else return Promise.resolve();
  // return Promise.resolve();
};
