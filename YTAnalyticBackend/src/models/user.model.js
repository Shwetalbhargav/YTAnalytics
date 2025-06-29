const pool = require('../config/db');

// Create a new user with hashed password
const createUser = async (email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
    [email, hashedPassword]
  );
  return result.rows[0];
};
// Retrieve user by email
const getUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
};
