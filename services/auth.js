const jwt = require("jsonwebtoken");
const passport = require("./passport");

// JWT Middleware
const authJWT = (req, res, next) => {
  const authHead = req.headers.authorization;
  if (authHead) {
    if (DEBUG) console.log("in authHead");
    const token = authHead.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("JWT Verification Error:", err);
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  } else {
    req.session.stat = "you need to be logged in to search";
    res.redirect("/login");
  }
};

const setTok = (req, res, next) => {
  if (req.session && req.session.token) {
    req.headers["authorization"] = `Bearer ${req.session.token}`;
  }
  next();
};

// Route Handlers for Google OAuth
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/login",
});

const googleAuthHandler = (req, res) => {
  // Generate a JWT token and store it in the session
  if (!req.user || !req.user.user_id) {
    console.error("User object or user_id is missing", req.user);
    return res.redirect("/login");
  }

  const token = jwt.sign(
    { user_id: req.user.user_id, username: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  req.session.token = token;
  res.redirect("/");
};

module.exports = {
  authJWT,
  setTok,
  googleAuth,
  googleAuthCallback,
  googleAuthHandler,
};
