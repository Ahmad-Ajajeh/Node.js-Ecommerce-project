const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "CATEGORY-NAME IS REQUIRED"],
      unique: [true, "CATEGORY-NAME IS ALREADY USED"],
      minLength: [3, "CATEGORY-NAME IS TOO SHORT"],
      maxLength: [32, "CATEGORY-NAME IS TOO LONG"],
    },
    //A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", setImageUrl);

categorySchema.post("save", setImageUrl);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
