const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/test-postgres", async (req, res) => {
  console.log("Received request to test PostgreSQL connection...");
  try {
    if (!db.pool) {
      throw new Error("PostgreSQL pool is not initialized");
    }
    console.log("PostgreSQL pool is initialized. Attempting query...");
    const result = await db.pool.query("SELECT NOW()");
    console.log("Query successful:", result);
    res.send(`PostgreSQL connected: ${result.rows[0].now}`);
  } catch (err) {
    console.log("PostgreSQL connection error:", err);
    res.status(500).send(`PostgreSQL connection error: ${err.message}`);
  }
});

module.exports = router;
