const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "THE PRODUCT TITLE IS REQUIRED"],
      trim: true,
      minlength: [3, "THE PRODUCT TITLE IS TOO SHORT"],
      maxlength: [100, "THE PRODUCT TITLE IS TOO LONG"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "THE PRODUCT DESCRIPTION IS REQUIRED"],
      minlength: [20, "TOO SHORT PRODUCT DESCRIPTION"],
      maxlength: [1024, "TOO LONG PRODUCT DESCRIPTION"],
    },
    quantity: {
      type: Number,
      min: [1, "THE PRODUCT QUANTITY SHOULD BE AT LEAST 1"],
      required: [true, "PRODUCT QUANTITY IS REQUIRED"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "PRODUCT PRICE IS REQUIRED"],
      trim: true,
      max: [100000.0, "TOO SMALL PRODUCT PRICE"],
      min: [0.59, "TOO LARGE PRODUCT PRICE"],
    },
    postDiscountPrice: {
      type: Number,
    },
    colors: {
      type: [String],
    },
    coverImage: {
      type: String,
      required: [true, "PRODUCT IMAGE COVER IS REQUIRED"],
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "THE PRODUCT MUST BELONG TO A CATEGORY"],
    },
    subCategories: {
      type: [mongoose.Types.ObjectId],
      ref: "SubCategory",
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      //   required: [true, "THE PRODUCT MUST BELONG TO A BRAND"],
    },
    ratingsAverage: {
      type: Number,
      min: [1, "RATING MUST BE GREATER OR EQUAL 1"],
      max: [5, "THE RATING MUST BE SMALLER OR EQUAL 5"],
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const setImageUrl = (doc) => {
  if (doc.coverImage) {
    const imageUrl = `${process.env.BASE_URL}/prodcuts/${doc.coverImage}`;
    doc.coverImage = imageUrl;
  }
  if (doc.images) {
    let images = [];
    doc.images.forEach((im) => {
      const imageUrl = `${process.env.BASE_URL}/prodcuts/${im}`;
      images.push(imageUrl);
    });
    doc.images = images;
  }
};

productSchema.post("init", setImageUrl);

productSchema.post("save", setImageUrl);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "title -_id",
  });
  next();
});

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

module.exports = mongoose.model("Product", productSchema);
