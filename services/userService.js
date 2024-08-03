const db = require("./db");

const createUser = async (
  username,
  email,
  password = null,
  oauth_provider = null,
  oauth_id = null
) => {
  const result = await db.pool.query(
    "INSERT INTO users (username, email, password, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [username, email, password, oauth_provider, oauth_id]
  );
  return result.rows[0];
};

const getUserById = async (user_id) => {
  const result = await db.pool.query("SELECT * FROM users WHERE user_id = $1", [
    user_id,
  ]);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
