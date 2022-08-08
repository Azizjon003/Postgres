class AppError extends Error {
  constructor(message, statusCode, status) {
    super(message);
    this.statusCode = statusCode || 404;
    this.status = "fail";
  }
}
module.exports = AppError;
