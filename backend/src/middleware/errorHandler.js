import config from '../config/index.js';
import AppError from '../utils/AppError.js';

// Handle 404 Not Found errors
const notFound = (req, res, next) => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: config.nodeEnv === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };