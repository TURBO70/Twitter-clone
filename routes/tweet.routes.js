const express = require("express");
const router = express.Router();

const {
  postTweet,
  getTweets,
  likeTweet,
  unlikeTweet,
  getReplies,
  newsfeed,
  replyTweet,
  userReplies,
  userLikes,
  deleteTweet,
} = require("../controllers/tweet.controllers");

const {
  postTweetValidator,
  getTweetsValidator,
  replyTweetValidator,
  likeTweetValidator,
  unlikeTweetValidator,
  userRepliesValidator,
} = require("../utils/validators/tweetValidator.validators.utils");
const { auth } = require("../middlewares/auth");

// Route to create a tweet
router.post("/postTweet", auth, postTweet); //

// Route to get tweets
router.get("/getTweets", auth, getTweets); //

// Route to like a tweet
router.post("/likeTweet", auth, likeTweet); //

// Route to unlike a tweet
router.post("/unlikeTweet", auth, unlikeTweet); //

// Route to get replies
router.get("/getReplies", auth, getReplies); //

// Route to get newsfeed
router.get("/newsfeed", auth, newsfeed);

// Route to reply to a tweet
router.post("/replyTweet", auth, replyTweet); //

// Route to get user replies
router.get("/userReplies", auth, userReplies); //

// Route to get user likes
router.get("/userLikes", auth, userLikes); //

// Route to delete a tweet
router.delete("/deleteTweet", auth, deleteTweet); //

module.exports = router;
