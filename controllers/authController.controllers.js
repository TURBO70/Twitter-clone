
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const customError = require("../utils/customError");

const signup = asyncHandler(async (req, res, next) => {
    // 1- create user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    // 2- Creat token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: JWT_EXPIRE_TIME,
    });
    res.status(201).json({ data: user, token });
  });
  
  const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) {
      return next(new customError("incorrect email or password", 401));
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return next(new customError("incorrect email or password", 401));
    }
  
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: JWT_EXPIRE_TIME,
    });
    res.status(200).json({ data: user, token });
  });


module.exports = { signup, login };