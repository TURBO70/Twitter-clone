const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/user.models");

exports.postTweetValidator = [
  check("text")
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ min: 1, max: 280 })
    .withMessage("Text must be between 1 and 280 characters"),

  validatorMiddleware,
];

exports.getTweetsValidator = [
  query("username").notEmpty().withMessage("Username is required"),

  validatorMiddleware,
];

exports.replyTweetValidator = [
  body("text")
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ min: 1, max: 280 })
    .withMessage("Text must be between 1 and 280 characters"),

  body("orgTweetID")
    .notEmpty()
    .withMessage("Original tweet ID is required")
    .isMongoId()
    .withMessage("Invalid tweet ID"),

  validatorMiddleware,
];

exports.likeTweetValidator = [
  body("tweetID")
    .notEmpty()
    .withMessage("Tweet ID is required")
    .isMongoId()
    .withMessage("Invalid tweet ID"),

  validatorMiddleware,
];

exports.unlikeTweetValidator = [
  body("tweetID")
    .notEmpty()
    .withMessage("Tweet ID is required")
    .isMongoId()
    .withMessage("Invalid tweet ID"),

  validatorMiddleware,
];

exports.userRepliesValidator = [
  query("userID")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  validatorMiddleware,
];

exports.userLikesValidator = [
  query("userID")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  validatorMiddleware,
];

exports.getTweetValidator = [
  param("id")
    .notEmpty()
    .withMessage("Tweet ID is required")
    .isMongoId()
    .withMessage("Invalid Tweet ID"),

  validatorMiddleware,
];

exports.getRepliesValidator = [
  body("tweetID")
    .notEmpty()
    .withMessage("Tweet ID is required")
    .isMongoId()
    .withMessage("Invalid Tweet ID"),

  validatorMiddleware,
];
