const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const customError = require("../utils/customError");
const sendEmail = require("../utils/sendEmail");
const pool = require("../config/db.config");

const signup = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

   
    const query = `
      INSERT INTO users (username, email, password, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, username, email
    `;
    const values = [req.body.username, req.body.email, hashedPassword];
    
    const { rows: [user] } = await client.query(query, values);

    
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });

    await client.query('COMMIT');
    res.status(201).json({ data: user, token });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.constraint === 'users_email_key') {
      return next(new customError("Email already exists", 400));
    }
    next(error);
  } finally {
    client.release();
  }
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows: [user] } = await pool.query(query, [email]);

  if (!user) {
    return next(new customError("incorrect email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new customError("incorrect email or password", 401));
  }

  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  
  delete user.password; // Don't send password in response
  res.status(200).json({ data: user, token });
});

const editInfo = asyncHandler(async (req, res, next) => {
  const query = `
    UPDATE users 
    SET additional_data = $1
    WHERE email = $2
    RETURNING *
  `;
  
  const { rows: [user] } = await pool.query(query, [req.body, req.user.email]);
  
  if (!user) {
    return next(new customError("User not found", 404));
  }
  
  res.status(200).json(user);
});

const getUser = asyncHandler(async (req, res, next) => {
  const { username, userID } = req.query;
  let query, values;

  if (username) {
    query = 'SELECT * FROM users WHERE username = $1';
    values = [username];
  } else if (userID) {
    query = 'SELECT * FROM users WHERE id = $1';
    values = [userID];
  } else {
    return next(new customError("Username or userID required", 400));
  }

  const { rows: [user] } = await pool.query(query, values);

  if (!user) {
    return next(new customError("User not found", 404));
  }

  delete user.password;
  res.json(user);
});

const follow = asyncHandler(async (req, res, next) => {
  const { userToBeFollowed } = req.query;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update followed user's followers array
    const followedQuery = `
      UPDATE users 
      SET followers = COALESCE(followers::jsonb || $1::jsonb, $1::jsonb)
      WHERE username = $2
      RETURNING username
    `;
    const followedValues = [JSON.stringify([req.user.id]), userToBeFollowed];
    const { rows: [followedUser] } = await client.query(followedQuery, followedValues);

    if (!followedUser) {
      throw new customError("User to follow not found", 404);
    }

    // Update following user's following array
    const followingQuery = `
      UPDATE users 
      SET following = COALESCE(following::jsonb || $1::jsonb, $1::jsonb)
      WHERE id = $2
      RETURNING *
    `;
    const followingValues = [JSON.stringify([userToBeFollowed]), req.user.id];
    const { rows: [updatedUser] } = await client.query(followingQuery, followingValues);

    await client.query('COMMIT');
    
    emitter.emit("follow", req.user.username, userToBeFollowed);
    res.json(updatedUser);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

const unfollow = asyncHandler(async (req, res, next) => {
  const { userToBeUnFollowed } = req.query;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Remove from followers array
    const unfollowedQuery = `
      UPDATE users
      SET followers = (
        SELECT jsonb_agg(element)
        FROM jsonb_array_elements(followers::jsonb) element
        WHERE element::text != $1::text
      )
      WHERE id = $2
      RETURNING username
    `;
    const unfollowedValues = [req.user.id, userToBeUnFollowed];
    await client.query(unfollowedQuery, unfollowedValues);

    // Remove from following array
    const unfollowingQuery = `
      UPDATE users
      SET following = (
        SELECT jsonb_agg(element)
        FROM jsonb_array_elements(following::jsonb) element
        WHERE element::text != $1::text
      )
      WHERE id = $2
      RETURNING *
    `;
    const unfollowingValues = [userToBeUnFollowed, req.user.id];
    const { rows: [updatedUser] } = await client.query(unfollowingQuery, unfollowingValues);

    await client.query('COMMIT');
    res.json(updatedUser);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

const search = asyncHandler(async (req, res) => {
  const query = `
    SELECT * FROM users
    WHERE username ILIKE $1 OR email ILIKE $1
  `;
  const values = [`%${req.query.q}%`];
  
  const { rows: users } = await pool.query(query, values);
  res.json(users);
});

const randomuser = asyncHandler(async (req, res) => {
  const query = `
    SELECT * FROM users
    ORDER BY RANDOM()
    LIMIT 3
  `;
  
  const { rows: users } = await pool.query(query);
  res.json(users);
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Find user
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows: [user] } = await client.query(userQuery, [req.body.email]);

    if (!user) {
      return next(new customError(`No user for this email: ${req.body.email}`, 404));
    }

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    // Update user with reset code
    const updateQuery = `
      UPDATE users 
      SET 
        password_reset_code = $1,
        password_reset_expires = $2,
        password_reset_verified = false
      WHERE email = $3
    `;
    const updateValues = [
      hashResetCode,
      new Date(Date.now() + 10 * 60 * 1000),
      user.email
    ];
    await client.query(updateQuery, updateValues);

    const message = `Hi ${user.username},
      \n We received a request to reset the password on your Account.
      \n ${resetCode} \n Enter this code to complete the reset.
      \n Thanks for helping us keep your account secure.
      \n `;

    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (Valid For 10 min)",
      message,
    });

    await client.query('COMMIT');
    res.status(200).json({ status: "Success", message: "Reset Code sent to email" });
  } catch (error) {
    await client.query('ROLLBACK');
    next(new customError("There is an error in sending email", 500));
  } finally {
    client.release();
  }
});

const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode.toString())
    .digest("hex");

  const query = `
    UPDATE users
    SET password_reset_verified = true
    WHERE password_reset_code = $1
      AND password_reset_expires > CURRENT_TIMESTAMP
    RETURNING id
  `;
  
  const { rows: [user] } = await pool.query(query, [hashResetCode]);

  if (!user) {
    return next(new customError("Reset Code invalid or expired", 422));
  }

  res.status(200).json({ status: "success" });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Check user and verification
    const checkQuery = `
      SELECT * FROM users 
      WHERE email = $1 AND password_reset_verified = true
    `;
    const { rows: [user] } = await client.query(checkQuery, [req.body.email]);

    if (!user) {
      return next(new customError("Reset code not verified", 400));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    // Update password and reset fields
    const updateQuery = `
      UPDATE users
      SET 
        password = $1,
        password_reset_code = NULL,
        password_reset_expires = NULL,
        password_reset_verified = NULL
      WHERE email = $2
      RETURNING id
    `;
    await client.query(updateQuery, [hashedPassword, req.body.email]);

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });

    await client.query('COMMIT');
    res.status(200).json({ token });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

module.exports = {
  signup,
  login,
  follow,
  unfollow,
  getUser,
  search,
  randomuser,
  editInfo,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
};