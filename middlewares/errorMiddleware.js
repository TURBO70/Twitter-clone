const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  console.log(error)
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(error, res);
  } else {
    sendErrorForProd(error, res);
  }
};

const sendErrorForDev = (error, res) => {
  res.status(error.statusCode).json({
  //  console.log(error),
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorForProd = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

module.exports = globalError;
