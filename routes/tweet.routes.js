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
  replyTweet,
  userReplies,
  userLikes,
} = require("../controllers/tweet.controllers");
const { auth } = require("../middlewares/auth");

// Route to create a tweet
router.post("/postTweet", auth, createTweet);

// Route to get tweets
router.get("/getTweets", auth, getTweets);

// Route to like a tweet
router.post("/likeTweet", auth, likeTweet);

// Route to unlike a tweet
router.post("/unlikeTweet", auth, unlikeTweet);

// Route to get replies
router.get("/getReplies", auth, getReplies);

// Route to get newsfeed
router.post("/newsfeed", auth, newsfeed);

// Route to reply to a tweet
router.post("/replyTweet", auth, replyTweet);

// Route to get user replies 
router.get("/userReplies", auth, userReplies);

// Route to get user likes
router.get("/userLikes", auth, userLikes);


module.exports = router;
