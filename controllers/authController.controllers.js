const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.models");

const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const customError = require("../utils/customError");

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
  User.findOneAndUpdate(
    { _id: userToBeFollowed },
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
        res.send(e);
      });
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

module.exports = {
  signup,
  login,
  follow,
  unfollow,
  getUser,
  search,
  randomuser,
  editInfo,
};
