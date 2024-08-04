const db = require("../services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const myEmitter = require("../services/logEvents");

// Register a new user
const register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    req.session.token = token;
    req.session.user = user;
    myEmitter.emit("log", "register", `User registered: ${username}`);
    res.redirect("/login");
  } catch (err) {
    myEmitter.emit("error", "register", `Registration error: ${err.message}`);
    req.session.stat = err.message;
    res.redirect("/register");
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) {
      req.session.stat = "User not found";
      return res.redirect("/login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.stat = "Invalid credentials";
      return res.redirect("/login");
    }
    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    req.session.token = token;
    req.session.user = user;
    myEmitter.emit("log", "login", `User logged in: ${user.username}`);
    res.redirect("/search");
  } catch (err) {
    myEmitter.emit("error", "login", `Login error: ${err.message}`);
    req.session.stat = err.message;
    res.redirect("/login");
  }
};

module.exports = {
  register,
  login,
};
