const ApiError = require("../utils/apiError");

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.message == "invalid token" || err.message == "jwt expired")
      err = handleJWTInvalidSignature();
    sendErrorForProd(err, res);
  }
};

const handleJWTInvalidSignature = () =>
  new ApiError("INVALID TOKEN, PLEASE LOGIN AGAIN ...", 401);

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  res.status(err.statusCode).json({ status: err.status, message: err.message });
};

module.exports = globalErrorHandler;
