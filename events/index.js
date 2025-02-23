const EventEmitter = require("events");
const pool = require("../config/db.config"); // PostgreSQL pool connection

class Emitter extends EventEmitter {}

const emitter = new Emitter();

const saveNotification = async (text, username, link, client) => {
  try {
    const query = `
      INSERT INTO notifications (text, username, link, client, time, read)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [text, username, link, client, new Date(), false];

    const result = await pool.query(query, values);
    console.log("Notification saved:", result.rows[0]);
  } catch (error) {
    console.error("Error saving notification:", error);
  }
};

emitter.on("follow", (username, client) => {
  saveNotification("started following you", username, `/${username}`, client);
});

emitter.on("like", (username, tweetID, client) => {
  saveNotification("liked your tweet", username, `/status/${tweetID}`, client);
});

emitter.on("reply", (username, tweetID, client) => {
  saveNotification("replied to your tweet", username, `/status/${tweetID}`, client);
});

module.exports = emitter;
