const AppError = require("./appError");

const catchAsync = (funksiya) => {
  const func = async (req, res, next) => {
    await funksiya(req, res, next).catch((err) => {
      next(new AppError(err.message, err.statusCode));
    });
  };
  return func;
};

module.exports = catchAsync;
