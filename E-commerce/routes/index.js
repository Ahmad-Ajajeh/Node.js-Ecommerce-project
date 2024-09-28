const categoryRoutes = require("./category");
const subCategoryRoutes = require("./subCategory");
const brandRouter = require("./brand");
const productRouter = require("./product");
const userRouter = require("./user");
const authRouter = require("./auth");
const reviewRouter = require("./review");
const wishlistRouter = require("./wishlist");
const addressRouter = require("./address");
const couponRouter = require("./coupon");
const cartRouter = require("./cart");
const orderRouter = require("./order");

const mountRoutes = (app) => {
  app.use("/api/users", userRouter);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/sub_categories", subCategoryRoutes);
  app.use("/api/brands", brandRouter);
  app.use("/api/products", productRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/address", addressRouter);
  app.use("/api/coupons", couponRouter);
  app.use("/api/carts", cartRouter);
  app.use("/api/orders", orderRouter);
};

module.exports = mountRoutes;
