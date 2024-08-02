const express = require("express");
const router = express.Router();
const mongoose = require("../services/db").mongoose;

router.get("/test-mongo", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send("MongoDB connected");
  } catch (err) {
    res.status(500).send(`MongoDB connection error: ${err.message}`);
  }
});

module.exports = router;
