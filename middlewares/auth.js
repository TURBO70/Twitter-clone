const jwt = require('jsonwebtoken');
const User = require('../models/user.models');
const customError = require('../utils/customError');

// Ensure that your secret key is loaded from environment variables
const JWT_SECRET = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
  // Extract token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new customError('Authentication invalid', 401));
  }

  // Get the token by removing 'Bearer ' prefix
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Find the user by ID from the payload
    const user = await User.findById(payload.userId);

    if (!user) {
      return next(new customError('Invalid Credentials', 401));
    }

    // Attach the user object to the request object
    req.user = user;
    next();
  } catch (error) {
    return next(new customError('Authentication invalid', 400));
  }
};

module.exports = { auth };
