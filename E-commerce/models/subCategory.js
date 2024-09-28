const mongoose = require("mongoose");
const Category = require("./category");

const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: [true, "SUBCATEGORY NAME SHOULD BE UNIQUE"],
      minlength: [2, "SUBCATEGORY NAME IS TOO SHORT"],
      maxlength: [32, "SUBCATEGORY NAME IS TOO LONG"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: Category,
      required: [true, "SUBCATEGORY MUST BE BELONGED TO A CATEGORY"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
