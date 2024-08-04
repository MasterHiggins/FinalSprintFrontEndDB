const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/search");
  }
  if (DEBUG) console.log("GET /register");
  res.render("register", { stat: req.session.stat, user: req.user });
});

router.post("/", async (req, res) => {
  if (DEBUG) console.log("POST /register");
  try {
    await authController.register(req, res);
  } catch (error) {
    console.error("Error in register route:", error);
    req.session.stat = "Registration failed. Please try again.";
    res.redirect("/register");
  }
});

module.exports = router;
