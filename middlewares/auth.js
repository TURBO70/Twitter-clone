const jwt = require('jsonwebtoken');
const pool = require('../config/db.config'); // Import the database pool
const customError = require('../utils/customError');

const JWT_SECRET = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new customError('Authentication invalid', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Query the database to find the user by ID
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [payload.userId]);

    if (result.rows.length === 0) {
      return next(new customError('Invalid Credentials', 401));
    }

    // Attach the user to the request object
    req.user = result.rows[0];
    next();
  } catch (error) {
    return next(new customError('Authentication invalid', 400));
  }
};

module.exports = { auth };
