const asyncHandler = require("express-async-handler");
const customError = require("../utils/customError");
const pool = require("../config/db.config");

const getNotifications = asyncHandler(async (req, res) => {
  const query = `
    SELECT * FROM notifications
    WHERE client = $1
    ORDER BY time DESC
  `;
  
  const { rows } = await pool.query(query, [req.user.id]);
  res.json(rows);
});

const readNotifications = asyncHandler(async (req, res) => {
  const query = `
    UPDATE notifications
    SET read = true
    WHERE id = $1
    RETURNING *
  `;
  
  try {
    const { rows } = await pool.query(query, [req.body.notificationID]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  getNotifications,
  readNotifications,
};