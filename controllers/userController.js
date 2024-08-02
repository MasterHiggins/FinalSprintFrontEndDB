const db = require("../services/db");
const bcrypt = require("bcrypt");

// Create a new user
const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error in createUser:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in getAllUsers:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching user with ID:", id);
  try {
    const result = await db.pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error in getUserById:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Updating user with ID:", id);
  try {
    const result = await db.pool.query(
      "UPDATE users SET username = $1, email = $2, password = $3 WHERE user_id = $4 RETURNING *",
      [username, email, hashedPassword, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error in updateUser:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log("Deleting user with ID:", id);
  try {
    const result = await db.pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error("Error in deleteUser:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
