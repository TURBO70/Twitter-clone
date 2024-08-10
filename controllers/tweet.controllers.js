const Tweet = require("../models/tweet.models");
const asyncHandler = require("express-async-handler");
const customError = require("../utils/customError");
const User = require("../models/user.models");
const emitter = require("../events");
const mongoose = require("mongoose");

const postTweet = asyncHandler(async (req, res, next) => {
  const tweet = {
    text: req.body.text,
    username: req.user.username,
    time: Date.now(),
  };
  const newTweet = await Tweet.create(tweet);
  res.status(201).json({ data: newTweet });
});

const getTweets = asyncHandler(async (req, res, next) => {
  let { username } = req.query;

  if (!username) {
    return next(customError("Not found", 401));
  }
  const tweets = await Tweet.find({ username }).sort({ time: -1 });

  res.status(200).json({ data: tweets });
});

const replyTweet = asyncHandler(async (req, res, next) => {
  let { text, orgTweetID } = req.body;

  let user = await User.findById(req.user._id);

  if (!user) {
    return next(customError("User not found", 400));
  }

  let tweetData = {
    _id: new mongoose.Types.ObjectId(), // Instantiate ObjectId correctly
    text,
    userID: req.user._id,
    hearts: [],
    retweets: [],
    replies: [],
    time: new Date(),
    repliedTo: orgTweetID,
  };

  let tweet = new Tweet(tweetData);

  tweet
    .save()
    .then((resp) => {
      Tweet.findByIdAndUpdate(orgTweetID, {
        $push: { replies: req.user._id },
      })
        .sort({ time: -1 })
        .then((res) => {
          emitter.emit("reply", user.username, orgTweetID, req.user._id);
        });
      return res.send(resp);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).send(e); // Changed to 500 status code for server errors
    });
});

const deleteTweet = asyncHandler(async (req, res, next) => {
  let { tweetID } = req.body;

  if (!tweetID) {
    return next(new customError("TweetID is required", 400));
  }

  
  const tweet = await Tweet.findById(tweetID);
  if (!tweet) {
    return next(new customError("Tweet not found", 404));
  }

  if (tweet.username !== req.user.username) {
    return next(new customError("You are not authorized to delete this tweet", 403));
  }

 
  await Tweet.findByIdAndDelete(tweetID);
  res.status(200).json({ message: "Tweet deleted successfully" });
});


const likeTweet = asyncHandler(async (req, res, next) => {
  let { tweetID } = req.body;

  Tweet.findOneAndUpdate({ _id: tweetID }, { $push: { hearts: req.user._id } })
    .then((response) => {
      if (response.userID !== req.user._id) {
        emitter.emit("like", req.user.username, tweetID, response.userID);
      }
      res.send(response);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
});

const unlikeTweet = asyncHandler(async (req, res, next) => {
  let { tweetID } = req.body;

  Tweet.findOneAndUpdate({ _id: tweetID }, { $pull: { hearts: req.user._id } })
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
});

const userReplies = asyncHandler(async (req, res) => {
  let { userID } = req.query;
  let tweets = await Tweet.find({ userID, repliedTo: { $ne: null } });
  if (tweets) {
    return res.send(tweets);
  } else {
    return next(customError("Not found", 404));
  }
});

const userLikes = asyncHandler(async (req, res, next) => {
  let { userID } = req.query;

  // Ensure userID is provided and is valid
  // if (!userID) {
  //   return next(new customError("UserID is required", 400));
  // }

  // Find tweets where the userID is in the hearts array
  let tweets = await Tweet.find({ hearts: userID });

  if (tweets.length > 0) {
    return res.send(tweets);
  } else {
    return next(new customError("No tweets found", 404));
  }
});

const getTweet = asyncHandler(async (req, res) => {
  let id = req.params.id;

  let tweet = await Tweet.findById(id);

  if (tweet) {
    return res.json(tweet);
  }

  return next(customError("Not found", 404));
});

const getReplies = asyncHandler(async (req, res) => {
  let { tweetID } = req.body;
  let tweets = await Tweet.find({ repliedTo: tweetID });
  if (tweets) {
    return res.send(tweets);
  } else {
    return next(customError("Not found", 404));
  }
});

const newsfeed = asyncHandler(async (req, res) => {
  let following = req.user.following;

  let tweets = await Tweet.find({
    userId: { $in: following },
    repliedTo: null,
  }).sort({ time: -1 });
  res.send(tweets);
});
module.exports = {
  postTweet,
  getTweets,
  replyTweet,
  likeTweet,
  unlikeTweet,
  getTweet,
  getReplies,
  userReplies,
  userLikes,
  newsfeed,
  deleteTweet
};
