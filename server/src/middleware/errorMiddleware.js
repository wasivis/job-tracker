const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = res.statusCode >= 400
    ? res.statusCode
    : 500;

  res.status(statusCode).json({
    message:
      statusCode === 500
        ? "Something went wrong"
        : err.message,
  });
};

module.exports = errorHandler;