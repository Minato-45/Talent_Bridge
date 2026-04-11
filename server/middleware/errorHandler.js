const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Validation Error', errors: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `Duplicate value for ${field}` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = { errorHandler };
