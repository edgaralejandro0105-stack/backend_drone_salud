const AppError = require('../utils/AppError');

const validateSchema = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues || result.error.errors || []
const messages = issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(messages, 400));
    }
    req.validatedBody = result.data;
    next();
  };
};

module.exports = validateSchema;