/* ================= DEV ERROR RESPONSE ================= */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    stack: err.stack,
    error: err
  });
};

/* ================= PROD ERROR RESPONSE ================= */
const sendErrorProd = (err, res) => {
  console.error("ERROR ", err);

  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Something went wrong"
  });
};

/* ================= GLOBAL ERROR HANDLER ================= */
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // MongoDB duplicate key error
  if (err.code === 11000) {
    err.message = "Duplicate field value";
    err.statusCode = 400;
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    err.message = "Invalid ID format";
    err.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors)
      .map(el => el.message)
      .join(". ");
    err.statusCode = 400;
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};
