const Redis = require("ioredis");
<<<<<<< HEAD

let redis;

if (process.env.NODE_ENV !== 'test') {
  redis = new Redis();

  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });
} else {
  // use a dummy mock in tests
  redis = {
    get: async () => null,
    setex: async () => {},
    del: async () => {},
  };
}
=======
const redis = new Redis(); 

redis.on("error", (err) => {
  console.error("Redis error:", err);
});
>>>>>>> f9427a513ab67f07b5af90207618beabf567a4c3

module.exports = redis;
