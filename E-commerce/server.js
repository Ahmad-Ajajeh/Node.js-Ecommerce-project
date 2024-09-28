//core modules
const path = require("path");

// packages requires
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// internal files
const mountRoutes = require("./routes");

const app = express();

// Adjust cors error .
app.use(cors());
app.options("*", cors());

// Compress all responses
app.use(compression());

// Configuration SetUp
dotenv.config({
  path: "config.env",
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
console.log(`mode : ${process.env.NODE_ENV}`);
const PORT = process.env.PORT || 8000;

// UTIL requires
const ApiError = require("./utils/apiError");

// Config requires
const dbConnection = require("./config/database");

// Middlewares requires
const globalErrorHandler = require("./middlewares/errorMiddleware");

// Connecting to DB
dbConnection();

// Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(mongoSanitize());
app.use(xss());

app.use(hpp({ whitelist: ["price", "sold", "quantity", "ratingsAverage"] }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: "TOO MANY REQUESTS, PLEASE WAIT AND TRY AGAIN LATER",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

// Mount Routes
mountRoutes(app);

// Global catch middleware
app.all("*", (req, res, next) => {
  next(new ApiError("PATH NOT FOUND - 404", 404));
});

// Global error handling middleware ( catches errors from express middleware pipeline only ).
app.use(globalErrorHandler);

//Running the server
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// attaching a callback for the unhandledRejection event listener
// to handle promise rejections outside express middlewares .
process.on("unhandledRejection", (err) => {
  console.error("UNHANDELED REJECTION");
  console.error(`${err.name} | ${err.message}`);
  server.close(() => {
    console.log("SHUTTING SERVER DOWN");
    process.exit(1);
  });
});
