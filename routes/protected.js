const express = require("express");
const router = express.Router();
const { authJWT } = require("../services/auth"); // Adjust path as needed

router.get("/protected", authJWT, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
