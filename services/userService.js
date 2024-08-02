const db = require("./db");

const getUserByEmail = async (email) => {
  const result = await db.pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await db.pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

const createUser = async (username, email, providerId) => {
  const result = await db.pool.query(
    "INSERT INTO users (username, email, provider_id) VALUES ($1, $2, $3) RETURNING *",
    [username, email, providerId]
  );
  return result.rows[0];
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
};
