const express = require("express");
const router = express.Router();

const {
  createTweet,
  getTweets,
  likeTweet,
  unlikeTweet,
  getReplies,
  getTweets,
  newsfeed,
  replyTweet
} = require("../controllers/tweet.controllers");
const { auth } = require("../middlewares/auth");

// Route to create a tweet
router.post("/postTweet", auth, createTweet);

// Route to get tweets
router.get("/getTweets", auth, getTweets);

module.exports = router;
