const asyncHandler = require("express-async-handler");
const customError = require("../utils/customError");
const pool = require("../config/db.config");
const emitter = require("../events");
const redis = require("../config/redisCache");


const postTweet = asyncHandler(async (req, res, next) => {
  const query = `
    INSERT INTO tweets (text, username, time)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [req.body.text, req.user.username, new Date()];
  
  const { rows } = await pool.query(query, values);
  res.status(201).json({ data: rows[0] });
});

const getTweets = asyncHandler(async (req, res, next) => {
  const { username } = req.query;

  if (!username) {
    return next(customError("Not found", 401));
  }

  const cacheKey = `tweets:${username}`;
  
  const cachedTweets = await redis.get(cacheKey);
  if (cachedTweets) {
    return res.status(200).json({ data: JSON.parse(cachedTweets) });
  }

  const query = `SELECT * FROM tweets WHERE username = $1 ORDER BY time DESC`;
  const { rows } = await pool.query(query, [username]);

  await redis.setex(cacheKey, 3600, JSON.stringify(rows));

  res.status(200).json({ data: rows });
});

const replyTweet = asyncHandler(async (req, res, next) => {
  const { text, orgTweetID } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if user exists
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userResult = await client.query(userQuery, [req.user.id]);
    
    if (userResult.rows.length === 0) {
      return next(customError("User not found", 400));
    }

    // Create reply tweet
    const tweetQuery = `
      INSERT INTO tweets (text, user_id, time, replied_to_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const tweetValues = [text, req.user.id, new Date(), orgTweetID];
    const newTweet = await client.query(tweetQuery, tweetValues);

    // Update original tweet's replies
    const updateQuery = `
      UPDATE tweets
      SET replies = COALESCE(replies::jsonb || $1::jsonb, $1::jsonb)
      WHERE id = $2
      RETURNING *
    `;
    const updateValues = [JSON.stringify([req.user.id]), orgTweetID];
    await client.query(updateQuery, updateValues);

    await client.query('COMMIT');
    
    emitter.emit("reply", userResult.rows[0].username, orgTweetID, req.user.id);
    res.status(201).json(newTweet.rows[0]);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

const deleteTweet = asyncHandler(async (req, res, next) => {
  const { tweetID } = req.body;

  if (!tweetID) {
    return next(customError("TweetID is required", 400));
  }

  const checkQuery = `SELECT * FROM tweets WHERE id = $1`;
  const tweet = await pool.query(checkQuery, [tweetID]);

  if (tweet.rows.length === 0) {
    return next(customError("Tweet not found", 404));
  }

  if (tweet.rows[0].username !== req.user.username) {
    return next(customError("You are not authorized to delete this tweet", 403));
  }

  const deleteQuery = `DELETE FROM tweets WHERE id = $1`;
  await pool.query(deleteQuery, [tweetID]);

  await redis.del(`tweets:${req.user.username}`);

  res.status(200).json({ message: "Tweet deleted successfully" });
});


const likeTweet = asyncHandler(async (req, res, next) => {
  const { tweetID } = req.body;
  
  const query = `
    UPDATE tweets
    SET hearts = COALESCE(hearts::jsonb || $1::jsonb, $1::jsonb)
    WHERE id = $2
    RETURNING *
  `;
  const values = [JSON.stringify([req.user.id]), tweetID];
  
  const { rows } = await pool.query(query, values);
  
  if (rows[0].user_id !== req.user.id) {
    emitter.emit("like", req.user.username, tweetID, rows[0].user_id);
  }
  
  res.json(rows[0]);
});

const unlikeTweet = asyncHandler(async (req, res, next) => {
  const { tweetID } = req.body;
  
  const query = `
    UPDATE tweets
    SET hearts = (
      SELECT jsonb_agg(element)
      FROM jsonb_array_elements(hearts::jsonb) element
      WHERE element::text != $1::text
    )
    WHERE id = $2
    RETURNING *
  `;
  const values = [req.user.id, tweetID];
  
  const { rows } = await pool.query(query, values);
  res.json(rows[0]);
});

const userReplies = asyncHandler(async (req, res, next) => {
  const { userID } = req.query;
  
  const query = `
    SELECT * FROM tweets
    WHERE user_id = $1 AND replied_to_id IS NOT NULL
  `;
  const { rows } = await pool.query(query, [userID]);
  
  if (rows.length > 0) {
    res.json(rows);
  } else {
    return next(customError("Not found", 404));
  }
});

const userLikes = asyncHandler(async (req, res, next) => {
  const { userID } = req.query;
  const cacheKey = `likes:${userID}`;

  const cachedLikes = await redis.get(cacheKey);
  if (cachedLikes) {
    return res.json(JSON.parse(cachedLikes));
  }

  const query = `SELECT * FROM tweets WHERE hearts::jsonb ? $1`;
  const { rows } = await pool.query(query, [userID]);

  if (rows.length > 0) {
    await redis.setex(cacheKey, 3600, JSON.stringify(rows));
    res.json(rows);
  } else {
    return next(customError("No tweets found", 404));
  }
});


const getTweet = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const query = `
    SELECT * FROM tweets
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);

  if (rows.length > 0) {
    res.json(rows[0]);
  } else {
    return next(customError("Not found", 404));
  }
});

const getReplies = asyncHandler(async (req, res, next) => {
  const { tweetID } = req.body;
  const cacheKey = `replies:${tweetID}`;

  const cachedReplies = await redis.get(cacheKey);
  if (cachedReplies) {
    return res.json(JSON.parse(cachedReplies));
  }

  const query = `SELECT * FROM tweets WHERE replied_to_id = $1`;
  const { rows } = await pool.query(query, [tweetID]);

  if (rows.length > 0) {
    await redis.setex(cacheKey, 3600, JSON.stringify(rows));
    res.json(rows);
  } else {
    return next(customError("Not found", 404));
  }
});


const newsfeed = asyncHandler(async (req, res) => {
  const query = `
    SELECT * FROM tweets
    WHERE user_id = ANY($1::text[])
    AND replied_to_id IS NULL
    ORDER BY time DESC
  `;
  const { rows } = await pool.query(query, [req.user.following]);
  res.json(rows);
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