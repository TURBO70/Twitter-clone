const { check, query, param, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

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
    .isInt()
    .withMessage("Invalid tweet ID (must be an integer)"),
  validatorMiddleware,
];

exports.likeTweetValidator = [
  body("tweetID")
    .notEmpty()
    .withMessage("Tweet ID is required")
    .isInt()
    .withMessage("Invalid tweet ID (must be an integer)"),
  validatorMiddleware,
];

exports.unlikeTweetValidator = [
  body("tweetID")
    .notEmpty()
    .withMessage("Tweet ID is required")
    .isInt()
    .withMessage("Invalid tweet ID (must be an integer)"),
  validatorMiddleware,
];

exports.userRepliesValidator = [
  query("userID")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("Invalid User ID (must be an integer)"),
  validatorMiddleware,
];

exports.userLikesValidator = [
  query("userID")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("Invalid User ID (must be an integer)"),
  validatorMiddleware,
];

exports.getTweetValidator = [
  param("id")
    .notEmpty()
    .withMessage("Tweet ID is required")
    .isInt()
    .withMessage("Invalid Tweet ID (must be an integer)"),
  validatorMiddleware,
];

exports.getRepliesValidator = [
  body("tweetID")
    .notEmpty()
    .withMessage("Tweet ID is required")
    .isInt()
    .withMessage("Invalid Tweet ID (must be an integer)"),
  validatorMiddleware,
];
