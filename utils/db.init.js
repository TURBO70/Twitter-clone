// utils/db.init.js
const pool = require('../config/db.config');

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL CHECK (LENGTH(username) >= 3),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 3),
        password_changed_at TIMESTAMP,
        password_reset_code VARCHAR(255),
        password_reset_expires TIMESTAMP,
        password_reset_verified BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        following JSON DEFAULT '[]',
        followers JSON DEFAULT '[]',
        additional_data JSON DEFAULT '{}'
      );
    `);

    // Create tweets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tweets (
        id SERIAL PRIMARY KEY,
        text VARCHAR(200) NOT NULL,
        username VARCHAR(255),
        hearts JSON DEFAULT '[]',
        retweets JSON DEFAULT '[]',
        replies JSON DEFAULT '[]',
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(255),
        replied_to_id INTEGER REFERENCES tweets(id),
        CONSTRAINT text_length CHECK (LENGTH(text) <= 200)
      );
    `);

    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        link VARCHAR(255),
        client VARCHAR(255),
        text TEXT,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        read BOOLEAN DEFAULT FALSE
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { initializeDatabase };