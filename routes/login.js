const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { addUser, getLoginByUsername } = require("../services/p.login.dal");

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/search");
  }
  if (DEBUG) console.log("in login.js");
  res.render("login", { stat: req.session.stat });
});

router.post("/", async (req, res, next) => {
  try {
    if (DEBUG) console.log("in post /");
    let user = await getLoginByUsername(req.body.username);
    if (!user) {
      req.session.stat = "wrong username";
      console.log("wrong username");
      res.redirect("/login");
      return;
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign(
        { user_id: user.user_id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        req.session.user = user;
        req.session.token = token;
        req.session.stat = `hello ${user.username}`;
        return res.redirect("/search");
      });
    } else {
      req.session.stat = "wrong password";
      console.log("wrong password");
      res.redirect("/login");
      return;
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
    return;
  }
});

router.get("/new", async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/search");
  }
  if (DEBUG) console.log("in login.js");
  res.render("register", { stat: req.session.stat });
});

router.post("/new", async (req, res) => {
  try {
    const hashPass = await bcrypt.hash(req.body.password, 10);
    if (req.body.email && req.body.username && req.body.password) {
      if (DEBUG) console.log("in /new");
      await addUser(req.body.username, req.body.email, hashPass);
      req.session.stat = `welcome ${req.body.username}`;
      console.log("new user made");
      return res.redirect("/login");
    } else {
      req.session.stat = "All fields are required.";
      console.log("All fields are required.");
      return res.redirect("/register");
    }
  } catch (error) {
    console.log(error);
    req.session.stat = "Registration failed.";
    return res.redirect("/register");
  }
});

module.exports = router;
