const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("Logout route hit");

  // Clear the JWT token
  res.clearCookie("token");

  // Passport logout
  req.logout((err) => {
    if (err) {
      console.error("Passport logout error:", err);
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }

      console.log("Session destroyed and user logged out");

      // Send a JSON response
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    });
  });
});

module.exports = router;
