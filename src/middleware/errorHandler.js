const AppError = require('../utils/AppError');

const handleSequelizeValidationError = (err) => {
  const messages = err.errors.map((e) => e.message).join('. ');
  return new AppError(messages, 400);
};

const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors?.[0]?.path || 'campo';
  return new AppError(`El ${field} ya existe`, 400);
};

const handleSequelizeForeignKeyConstraintError = () => {
  return new AppError('Referencia invalida, el registro relacionado no existe', 400);
};

const handleJWTError = () => new AppError('Token invalido', 401);
const handleJWTExpiredError = () => new AppError('Token expirado', 401);

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  if (err.name === 'SequelizeValidationError') error = handleSequelizeValidationError(err);
  if (err.name === 'SequelizeUniqueConstraintError') error = handleSequelizeUniqueConstraintError(err);
  if (err.name === 'SequelizeForeignKeyConstraintError') error = handleSequelizeForeignKeyConstraintError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  res.status(statusCode).json({
    status,
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;