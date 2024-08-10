const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.models");

const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const customError = require("../utils/customError");
const sendEmail = require("../utils/sendEmail");

const signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  // 2- Creat token
  const token = jwt.sign({ userId: user._id }, "r3yqr8", {
    expiresIn: "1h",
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

  const token = jwt.sign({ userId: user._id }, "secret", {
    expiresIn: "1H",
  });
  res.status(200).json({ data: user, token });
});


const editInfo = asyncHandler(async (req, res) => {
  // verify user stored in local storage and user in database

  let user = await User.findOne({ email: req.user.email });
  if (!user) {
    return next(new customError("User not found", 404));
  }
  User.findOneAndUpdate(
    { _id: user._id },
    { $set: { additionalData: req.body } }
  ).then((response) => {
    return res.sendStatus("200");
  });
});

const getUser = async (req, res) => {
  let { username, userID } = req.query;
  let user = username
    ? await User.findOne({ username })
    : userID
    ? await User.findById(userID)
    : false;

  if (!user) {
    return next(new customError("User not found", 404));
  }

  res.json(user);
};

const follow = asyncHandler(async (req, res) => {
  let { userToBeFollowed } = req.query;

  let user = await User.findById(req.user._id);

  // Find the user to be followed by username
  User.findOneAndUpdate(
    { username: userToBeFollowed },
    { $push: { followers: req.user._id } }
  ).then((response) => {
    User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { following: userToBeFollowed } }
    )
      .then((response_two) => {
        emitter.emit("follow", user.username, userToBeFollowed);
        res.send(response_two);
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  })
  .catch((e) => {
    res.status(500).send(e);
  });
});


const unfollow = asyncHandler(async (req, res) => {
  let { userToBeUnFollowed } = req.query;

  User.findOneAndUpdate(
    { _id: userToBeUnFollowed },
    { $pull: { followers: req.user._id } }
  )
    .then((response) => {
      User.findOneAndUpdate(
        { _id: auth.user._id },
        { $pull: { following: userToBeUnFollowed } }
      )
        .then((response_two) => {
          res.send(response_two);
        })
        .catch((e) => {
          res.send(e);
        });
    })
    .catch((e) => {
      res.send(e);
    });
});

const search = async (req, res) => {
  let query = req.query.q;
  let users = await User.find({ $text: { $search: query } });
  return res.send(users);
};

const randomuser = async (req, res) => {
  let users = await User.aggregate([{ $sample: { size: 3 } }]);
  return res.send(users);
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  //1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new customError(`No user for this email : ${req.body.email}`, 404)
    );
  }
  //2) If user exists, Generate hash reset random 6 digits.
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashedRestCode in db
  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.username},
   \n We received a request to reset the passwrd on your  Account .
    \n ${resetCode} \n Enter this code to complete the reset.
    \n Thanks for helping us keep your account secure.
     \n `;

  // 3-Send reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (Valid For 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new customError("There is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "Success", message: "Reset Code send to email " });
});


const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1- Get user baed on reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode.toString())
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new customError("Reset Code invalid or expired", 422));
  }
  //2) resetcode valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new customError(`No user for this email : ${req.body.email}`, 404)
    );
  }
  if (!user.passwordResetVerified) {
    return next(new customError("Reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  //3) if every thing is okay, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
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
