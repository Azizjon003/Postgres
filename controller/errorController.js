module.exports = async (error, req, res, next) => {
  error.status = "error";
  error.statusCode = error.statusCode || 500;
  error.message = error.message;
  res.status(error.statusCode).json({
    status: "error",
    message: error.message,
    info: error.stack,
  });
};
