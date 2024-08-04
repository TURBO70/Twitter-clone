const Tweet=require('../models/tweet.models');
const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');
const User = require('../models/user.models');

const createTweet = asyncHandler(async (req, res, next) => {
const tweet={
    text:req.body.text,
    time:Date.now(),
}
const newTweet=await Tweet.create(tweet);
res.status(201).json({data:newTweet});
});


const getTweets = asyncHandler(async (req, res, next) => {


});

const replyTweet = asyncHandler(async (req, res, next) => {


});

const likeTweet = asyncHandler(async (req, res, next) => {


});

const unlikeTweet = asyncHandler(async (req, res, next) => {


});