const express = require("express");
const router = express.Router();
const {
  googleAuth,
  googleAuthCallback,
  googleAuthHandler,
} = require("../services/auth");

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, googleAuthHandler);

router.post("/logout", (req, res) => {
  console.log("Logout route called");

  // Manually clear the user from the session
  req.session.user = null;

  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }

    // Clear the session cookie
    res.clearCookie("connect.sid");

    console.log("Session destroyed and cookie cleared");

    // Redirect to the login page
    res.redirect("/login");
  });
});

module.exports = router;
