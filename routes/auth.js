const express = require("express");
const {
  googleAuth,
  googleAuthCallback,
  googleAuthHandler,
} = require("../services/auth");
const router = express.Router();

router.get("/google", googleAuth);

router.get("/google/callback", googleAuthCallback, googleAuthHandler);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
