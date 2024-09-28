const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "THE BRAND TITLE IS REQUIRED"],
      unique: [true, "THE BRAND TITLE SHOULD BE UNIQUE"],
      minlength: [3, "THE BRAND TITLE IS TOO SHORT"],
      maxlength: [32, "THE BRAND TITLE IS TOO LONG"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", setImageUrl);

brandSchema.post("save", setImageUrl);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
