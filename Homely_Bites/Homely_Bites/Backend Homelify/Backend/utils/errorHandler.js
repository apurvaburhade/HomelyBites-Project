// Error handling middleware for Multer and general errors
const errorHandler = (err, req, res, next) => {
  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      error: 'File size exceeds 5MB limit'
    })
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      status: 'error',
      error: 'Too many files uploaded'
    })
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'error',
      error: err.message
    })
  }

  // Handle other errors
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({
      status: 'error',
      error: 'Only image files (JPEG, PNG, WEBP) are allowed'
    })
  }

  // Generic error
  res.status(500).json({
    status: 'error',
    error: err.message || 'An error occurred'
  })
}

module.exports = errorHandler
