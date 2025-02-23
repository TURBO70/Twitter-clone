const Redis = require("ioredis");
const redis = new Redis(); 

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redis;
