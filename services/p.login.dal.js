const db = require("./db");

// Function to add a new user
const addUser = async (username, email, password) => {
  const result = await db.pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return result.rows[0];
};

// Function to get user by username
const getLoginByUsername = async (username) => {
  const result = await db.pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0];
};

// Function to get user by email
const getUserByEmail = async (email) => {
  const result = await db.pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

module.exports = {
  addUser,
  getLoginByUsername,
  getUserByEmail,
};
